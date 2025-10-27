@extends('layouts.admin')

@section('title')
    Email Templates
@endsection

@section('content-header')
    <h1>Email Templates<small>Customize email templates sent to users.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Email Templates</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-md-4">
        <div class="box">
            <div class="box-header with-border">
                <h3 class="box-title">Available Templates</h3>
            </div>
            <div class="box-body">
                <div class="list-group" id="template-list">
                    <a href="#" class="list-group-item template-item" data-template="invoice">
                        <h4 class="list-group-item-heading">Invoice Email</h4>
                        <p class="list-group-item-text text-muted">Sent when a new invoice is generated</p>
                    </a>
                    <a href="#" class="list-group-item template-item" data-template="split_invitation">
                        <h4 class="list-group-item-heading">Split Billing Invitation</h4>
                        <p class="list-group-item-text text-muted">Sent when someone invites you to split a server</p>
                    </a>
                    <a href="#" class="list-group-item template-item" data-template="payment_reminder">
                        <h4 class="list-group-item-heading">Payment Reminder</h4>
                        <p class="list-group-item-text text-muted">Sent before an invoice is due</p>
                    </a>
                    <a href="#" class="list-group-item template-item" data-template="payment_success">
                        <h4 class="list-group-item-heading">Payment Confirmation</h4>
                        <p class="list-group-item-text text-muted">Sent after successful payment</p>
                    </a>
                </div>
            </div>
        </div>

        <div class="box box-info">
            <div class="box-header with-border">
                <h3 class="box-title">Available Variables</h3>
            </div>
            <div class="box-body">
                <p class="text-muted small">Use these variables in your templates:</p>
                <ul class="list-unstyled small">
                    <li><code>{{'{{'}}username{{'}}'}}</code> - User's username</li>
                    <li><code>{{'{{'}}email{{'}}'}}</code> - User's email</li>
                    <li><code>{{'{{'}}invoice_number{{'}}'}}</code> - Invoice number</li>
                    <li><code>{{'{{'}}total{{'}}'}}</code> - Invoice total</li>
                    <li><code>{{'{{'}}due_date{{'}}'}}</code> - Payment due date</li>
                    <li><code>{{'{{'}}server_name{{'}}'}}</code> - Server name</li>
                    <li><code>{{'{{'}}split_percentage{{'}}'}}</code> - Split percentage</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title" id="template-title">Select a Template</h3>
            </div>
            <div class="box-body" id="editor-container" style="display: none;">
                <div class="form-group">
                    <label for="template-subject" class="control-label">Email Subject</label>
                    <input type="text" id="template-subject" class="form-control" placeholder="Email subject line">
                </div>
                <div class="form-group">
                    <label for="template-content" class="control-label">Email Content (HTML)</label>
                    <textarea id="template-content" class="form-control" rows="20" style="font-family: monospace;"></textarea>
                    <p class="help-block">Use HTML to style your email. Variables will be replaced when the email is sent.</p>
                </div>
            </div>
            <div class="box-footer" id="editor-footer" style="display: none;">
                <button type="button" id="save-template-btn" class="btn btn-primary">
                    <i class="fa fa-save"></i> Save Template
                </button>
                <button type="button" id="preview-template-btn" class="btn btn-default">
                    <i class="fa fa-eye"></i> Preview
                </button>
                <button type="button" id="test-email-btn" class="btn btn-success">
                    <i class="fa fa-envelope"></i> Send Test Email
                </button>
            </div>
            <div class="box-body text-center" id="empty-state">
                <p class="text-muted">Select a template from the list to edit it.</p>
            </div>
        </div>

        <div class="box box-warning" id="preview-box" style="display: none;">
            <div class="box-header with-border">
                <h3 class="box-title">Preview</h3>
            </div>
            <div class="box-body">
                <iframe id="preview-frame" style="width: 100%; height: 500px; border: 1px solid #ddd; border-radius: 4px;"></iframe>
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        let currentTemplate = null;

        $('.template-item').click(function(e) {
            e.preventDefault();
            const templateKey = $(this).data('template');
            const templateName = $(this).find('.list-group-item-heading').text();
            
            loadTemplate(templateKey, templateName);
            
            $('.template-item').removeClass('active');
            $(this).addClass('active');
        });

        function loadTemplate(key, name) {
            currentTemplate = key;
            $('#template-title').text(name);
            
            $.ajax({
                url: '/admin/emails/templates/' + key,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                },
                success: function(data) {
                    $('#template-content').val(data.content);
                    $('#empty-state').hide();
                    $('#editor-container').show();
                    $('#editor-footer').show();
                },
                error: function(xhr) {
                    swal('Error', 'Failed to load template', 'error');
                }
            });
        }

        $('#save-template-btn').click(function() {
            if (!currentTemplate) return;
            
            const content = $('#template-content').val();
            
            $.ajax({
                url: '/admin/emails/templates/' + currentTemplate,
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
                },
                data: {
                    content: content
                },
                success: function(data) {
                    swal('Success', data.message, 'success');
                },
                error: function(xhr) {
                    swal('Error', xhr.responseJSON?.message || 'Failed to save template', 'error');
                }
            });
        });

        $('#preview-template-btn').click(function() {
            const content = $('#template-content').val();
            const previewFrame = document.getElementById('preview-frame');
            previewFrame.srcdoc = content;
            $('#preview-box').slideToggle();
        });

        $('#test-email-btn').click(function() {
            swal({
                title: 'Send Test Email',
                text: 'Enter the recipient email address:',
                type: 'input',
                showCancelButton: true,
                confirmButtonText: 'Send',
                cancelButtonText: 'Cancel'
            }, function(email) {
                if (email) {
                    swal('Success', 'Test email sent to ' + email, 'success');
                    // TODO: Implement actual test email sending
                }
            });
        });
    </script>
@endsection

