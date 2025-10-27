<?php

namespace Pterodactyl\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Pterodactyl\Models\Invoice;

class InvoiceGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public Invoice $invoice;

    /**
     * Create a new message instance.
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Your Invoice from GameControl - ' . $this->invoice->invoice_number)
            ->view('emails.invoice')
            ->with([
                'username' => $this->invoice->user->username,
                'invoice_number' => $this->invoice->invoice_number,
                'total' => number_format($this->invoice->total, 2),
                'due_date' => $this->invoice->due_date->format('F j, Y'),
                'description' => $this->invoice->description ?? 'Monthly Hosting',
                'credits_used' => number_format($this->invoice->credits_used, 2),
            ]);
    }
}

