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
        .button { display: inline-block; background: #0066ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invoice from GameControl</h1>
        </div>
        <div class="invoice-details">
            <p>Dear {{ $username }},</p>
            <p>Your invoice #{{ $invoice_number }} is ready.</p>
            <h3>Invoice Details:</h3>
            <p><strong>Amount:</strong> ${{ $total }}</p>
            @if($credits_used > 0)
                <p><strong>Credits Applied:</strong> ${{ $credits_used }}</p>
            @endif
            <p><strong>Due Date:</strong> {{ $due_date }}</p>
            <p><strong>Description:</strong> {{ $description }}</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ config('app.url') }}/billing" class="button">View Invoice</a>
            </div>
        </div>
        <div class="footer">
            <p>GameControl - Premium Game Server Hosting</p>
            <p>If you have any questions, contact us at support@gamecontrol.cc</p>
        </div>
    </div>
</body>
</html>

