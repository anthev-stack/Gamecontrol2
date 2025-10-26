@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'basic'])

@section('title')
    Credit Management
@endsection

@section('content-header')
    <h1>Credit Management<small>Manage user credits and view transaction history.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Credits</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box">
            <div class="box-header with-border">
                <h3 class="box-title">User Credit Management</h3>
            </div>
            <div class="box-body">
                <div id="credit-management-container"></div>
            </div>
        </div>
    </div>
</div>

<script>
    // Render React component
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('credit-management-container');
        if (container && window.CreditManagementContainer) {
            ReactDOM.render(
                React.createElement(window.CreditManagementContainer),
                container
            );
        }
    });
</script>
@endsection

