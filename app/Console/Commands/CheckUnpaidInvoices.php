<?php

namespace Pterodactyl\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Pterodactyl\Models\Invoice;
use Pterodactyl\Models\Server;
use Pterodactyl\Repositories\Wings\DaemonPowerRepository;

class CheckUnpaidInvoices extends Command
{
    protected $signature = 'billing:check-unpaid';
    protected $description = 'Check for unpaid invoices and suspend servers after 3 failed payment attempts';

    private DaemonPowerRepository $powerRepository;

    public function __construct(DaemonPowerRepository $powerRepository)
    {
        parent::__construct();
        $this->powerRepository = $powerRepository;
    }

    public function handle(): int
    {
        $this->info('Checking for unpaid invoices...');

        // Find overdue invoices (past due date)
        $overdueInvoices = Invoice::where('status', 'pending')
            ->where('due_date', '<', Carbon::now())
            ->with('server')
            ->get();

        foreach ($overdueInvoices as $invoice) {
            if (!$invoice->server) {
                continue;
            }

            $server = $invoice->server;

            // Check if we should attempt payment again today
            if (!$server->last_payment_attempt || $server->last_payment_attempt->isToday() === false) {
                // Reset daily attempts
                $server->failed_payment_attempts = 0;
                $server->save();
            }

            // Increment failed attempts
            $server->failed_payment_attempts++;
            $server->last_payment_attempt = now();
            $server->save();

            $this->warn("Server #{$server->id} ({$server->name}) - Failed payment attempt #{$server->failed_payment_attempts}");

            // After 3 attempts in one day, suspend the server
            if ($server->failed_payment_attempts >= 3 && !$server->suspended_for_billing) {
                $this->error("Suspending server #{$server->id} ({$server->name}) due to unpaid invoice");

                try {
                    // Stop the server
                    $this->powerRepository->setServer($server)->send('stop');
                    
                    // Mark as suspended
                    $server->suspended_for_billing = true;
                    $server->save();

                    $this->info("Server #{$server->id} suspended successfully");
                } catch (\Exception $e) {
                    $this->error("Failed to suspend server #{$server->id}: " . $e->getMessage());
                }
            }
        }

        $this->info('Finished checking unpaid invoices');
        return 0;
    }
}

