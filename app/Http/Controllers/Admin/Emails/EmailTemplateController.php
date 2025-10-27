<?php

namespace Pterodactyl\Http\Controllers\Admin\Emails;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Pterodactyl\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class EmailTemplateController extends Controller
{
    /**
     * Display the email template editor.
     */
    public function index(): View
    {
        return view('admin.emails.index');
    }

    /**
     * Get all available email templates.
     */
    public function getTemplates(): JsonResponse
    {
        $templates = [
            [
                'key' => 'invoice',
                'name' => 'Invoice Email',
                'description' => 'Sent when a new invoice is generated',
                'subject' => 'Your Invoice from GameControl',
            ],
            [
                'key' => 'split_invitation',
                'name' => 'Split Billing Invitation',
                'description' => 'Sent when someone invites you to split a server',
                'subject' => 'You\'ve been invited to split a server',
            ],
            [
                'key' => 'payment_reminder',
                'name' => 'Payment Reminder',
                'description' => 'Sent before an invoice is due',
                'subject' => 'Payment Reminder - Invoice Due Soon',
            ],
            [
                'key' => 'payment_success',
                'name' => 'Payment Confirmation',
                'description' => 'Sent after successful payment',
                'subject' => 'Payment Received - Thank You!',
            ],
        ];

        return response()->json($templates);
    }

    /**
     * Get a specific template content.
     */
    public function getTemplate(string $key): JsonResponse
    {
        // For now, return default templates
        // In production, you'd load from database or files
        $templates = [
            'invoice' => $this->getDefaultInvoiceTemplate(),
            'split_invitation' => $this->getDefaultSplitInvitationTemplate(),
            'payment_reminder' => $this->getDefaultPaymentReminderTemplate(),
            'payment_success' => $this->getDefaultPaymentSuccessTemplate(),
        ];

        if (!isset($templates[$key])) {
            return response()->json(['error' => 'Template not found'], 404);
        }

        return response()->json([
            'content' => $templates[$key],
        ]);
    }

    /**
     * Update a template.
     */
    public function updateTemplate(Request $request, string $key): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        // For now, just return success
        // In production, save to database or file
        return response()->json([
            'success' => true,
            'message' => 'Template updated successfully',
        ]);
    }

    private function getDefaultInvoiceTemplate(): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .invoice-details { margin: 30px 0; }
        .total { font-size: 24px; font-weight: bold; color: #0066ff; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invoice from GameControl</h1>
        </div>
        <div class="invoice-details">
            <p>Dear {{username}},</p>
            <p>Your invoice #{{invoice_number}} is ready.</p>
            <h3>Invoice Details:</h3>
            <p><strong>Amount:</strong> ${{total}}</p>
            <p><strong>Due Date:</strong> {{due_date}}</p>
            <p><strong>Description:</strong> {{description}}</p>
        </div>
        <div class="footer">
            <p>GameControl - Premium Game Server Hosting</p>
            <p>If you have any questions, contact us at support@gamecontrol.cc</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    private function getDefaultSplitInvitationTemplate(): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .button { display: inline-block; background: #0066ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Server Sharing Invitation</h1>
        </div>
        <div style="margin: 30px 0;">
            <p>Hey there!</p>
            <p>{{inviter_name}} has invited you to split the cost of their server: <strong>{{server_name}}</strong></p>
            <p>You'll pay {{split_percentage}}% of the monthly costs and get full access to the server.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{accept_url}}" class="button">Accept Invitation</a>
                <a href="{{decline_url}}" class="button" style="background: #666;">Decline</a>
            </div>
        </div>
        <div class="footer">
            <p>GameControl - Premium Game Server Hosting</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    private function getDefaultPaymentReminderTemplate(): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .button { display: inline-block; background: #0066ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Reminder</h1>
        </div>
        <div style="margin: 30px 0;">
            <p>Hi {{username}},</p>
            <p>This is a friendly reminder that you have an upcoming payment due.</p>
            <p><strong>Invoice #:</strong> {{invoice_number}}</p>
            <p><strong>Amount:</strong> ${{total}}</p>
            <p><strong>Due Date:</strong> {{due_date}}</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{payment_url}}" class="button">Pay Now</a>
            </div>
        </div>
        <div class="footer">
            <p>GameControl - Premium Game Server Hosting</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    private function getDefaultPaymentSuccessTemplate(): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Payment Received!</h1>
        </div>
        <div style="margin: 30px 0;">
            <p>Hi {{username}},</p>
            <p>Thank you for your payment! Your invoice has been marked as paid.</p>
            <p><strong>Invoice #:</strong> {{invoice_number}}</p>
            <p><strong>Amount Paid:</strong> ${{total}}</p>
            <p><strong>Payment Date:</strong> {{paid_date}}</p>
            <p>Your servers will continue running without interruption.</p>
        </div>
        <div class="footer">
            <p>GameControl - Premium Game Server Hosting</p>
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}

