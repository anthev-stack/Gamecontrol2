@extends('layouts.admin')

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
                <h3 class="box-title">Search User</h3>
            </div>
            <div class="box-body">
                <div class="form-group">
                    <label for="user_id" class="control-label">User ID</label>
                    <div class="input-group">
                        <input type="number" id="user_id" class="form-control" placeholder="Enter User ID">
                        <span class="input-group-btn">
                            <button class="btn btn-primary" type="button" id="search-user-btn">
                                <i class="fa fa-search"></i> Search
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="user-info" style="display: none;">
    <div class="row">
        <div class="col-md-6">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">User Information</h3>
                </div>
                <div class="box-body">
                    <table class="table table-bordered">
                        <tr>
                            <th>Username</th>
                            <td id="user-username"></td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td id="user-email"></td>
                        </tr>
                        <tr>
                            <th>User ID</th>
                            <td id="user-id"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="box box-success">
                <div class="box-header with-border">
                    <h3 class="box-title">Current Balance</h3>
                </div>
                <div class="box-body text-center">
                    <h1 id="user-credits" class="text-success" style="font-size: 3em; margin: 0;"></h1>
                    <p class="text-muted">Credits</p>
                    <h3 id="user-dollar-value" class="text-primary"></h3>
                    <p class="text-muted">Dollar Value</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
            <div class="box box-success">
                <div class="box-header with-border">
                    <h3 class="box-title">Add Credits</h3>
                </div>
                <div class="box-body">
                    <div class="form-group">
                        <label for="add-amount" class="control-label">Amount (Credits)</label>
                        <input type="number" id="add-amount" class="form-control" placeholder="Enter credit amount" min="1">
                        <p class="help-block">10 credits = $1.00</p>
                    </div>
                    <div class="form-group">
                        <label for="add-type" class="control-label">Type</label>
                        <select id="add-type" class="form-control">
                            <option value="admin_grant">Admin Grant</option>
                            <option value="giveaway">Giveaway</option>
                            <option value="referral">Referral Bonus</option>
                            <option value="payment">Payment Refund</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="add-description" class="control-label">Description (Optional)</label>
                        <textarea id="add-description" class="form-control" rows="3" placeholder="Enter reason for credit adjustment..."></textarea>
                    </div>
                </div>
                <div class="box-footer">
                    <button type="button" id="add-credits-btn" class="btn btn-success">
                        <i class="fa fa-plus"></i> Add Credits
                    </button>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="box box-danger">
                <div class="box-header with-border">
                    <h3 class="box-title">Remove Credits</h3>
                </div>
                <div class="box-body">
                    <div class="form-group">
                        <label for="remove-amount" class="control-label">Amount (Credits)</label>
                        <input type="number" id="remove-amount" class="form-control" placeholder="Enter credit amount" min="1">
                        <p class="help-block">10 credits = $1.00</p>
                    </div>
                    <div class="form-group">
                        <label for="remove-description" class="control-label">Description (Optional)</label>
                        <textarea id="remove-description" class="form-control" rows="3" placeholder="Enter reason for credit removal..."></textarea>
                    </div>
                </div>
                <div class="box-footer">
                    <button type="button" id="remove-credits-btn" class="btn btn-danger">
                        <i class="fa fa-minus"></i> Remove Credits
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Transaction History</h3>
                </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Dollar Value</th>
                                <th>Admin</th>
                            </tr>
                        </thead>
                        <tbody id="transactions-table">
                            <tr>
                                <td colspan="6" class="text-center text-muted">No transactions yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        let currentUserId = null;

        function searchUser() {
            const userId = $('#user_id').val();
            if (!userId) {
                swal('Error', 'Please enter a user ID', 'error');
                return;
            }

            $.ajax({
                url: '/admin/credits/users/' + userId,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(data) {
                    currentUserId = userId;
                    displayUserInfo(data);
                    $('#user-info').show();
                },
                error: function(xhr) {
                    swal('Error', xhr.responseJSON?.message || 'Failed to load user', 'error');
                    $('#user-info').hide();
                }
            });
        }

        function displayUserInfo(data) {
            $('#user-username').text(data.user.username);
            $('#user-email').text(data.user.email);
            $('#user-id').text(data.user.id);
            $('#user-credits').text(data.credits);
            $('#user-dollar-value').text('$' + data.dollar_value.toFixed(2));

            const tbody = $('#transactions-table');
            tbody.empty();

            if (data.transactions.length > 0) {
                data.transactions.forEach(function(transaction) {
                    const date = new Date(transaction.created_at).toLocaleString();
                    const type = transaction.type.replace('_', ' ');
                    const amountClass = transaction.amount > 0 ? 'text-success' : 'text-danger';
                    const amountSign = transaction.amount > 0 ? '+' : '';
                    
                    tbody.append(`
                        <tr>
                            <td>${date}</td>
                            <td><span class="text-capitalize">${type}</span></td>
                            <td>${transaction.description || 'No description'}</td>
                            <td class="${amountClass}"><strong>${amountSign}${transaction.amount}</strong></td>
                            <td class="${amountClass}"><strong>${amountSign}$${transaction.dollar_value.toFixed(2)}</strong></td>
                            <td>${transaction.admin ? transaction.admin.username : '-'}</td>
                        </tr>
                    `);
                });
            } else {
                tbody.append('<tr><td colspan="6" class="text-center text-muted">No transactions yet</td></tr>');
            }
        }

        function addCredits() {
            const amount = $('#add-amount').val();
            const type = $('#add-type').val();
            const description = $('#add-description').val();

            if (!amount || amount < 1) {
                swal('Error', 'Please enter a valid amount', 'error');
                return;
            }

            $.ajax({
                url: '/admin/credits/users/' + currentUserId,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: {
                    amount: parseInt(amount),
                    type: type,
                    description: description || null
                },
                success: function(data) {
                    swal('Success', data.message, 'success');
                    $('#add-amount').val('');
                    $('#add-description').val('');
                    searchUser();
                },
                error: function(xhr) {
                    swal('Error', xhr.responseJSON?.message || 'Failed to add credits', 'error');
                }
            });
        }

        function removeCredits() {
            const amount = $('#remove-amount').val();
            const description = $('#remove-description').val();

            if (!amount || amount < 1) {
                swal('Error', 'Please enter a valid amount', 'error');
                return;
            }

            swal({
                title: 'Are you sure?',
                text: 'Remove ' + amount + ' credits from this user?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove credits'
            }, function() {
                $.ajax({
                    url: '/admin/credits/users/' + currentUserId,
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {
                        amount: parseInt(amount),
                        description: description || null
                    },
                    success: function(data) {
                        swal('Success', data.message, 'success');
                        $('#remove-amount').val('');
                        $('#remove-description').val('');
                        searchUser();
                    },
                    error: function(xhr) {
                        swal('Error', xhr.responseJSON?.message || 'Failed to remove credits', 'error');
                    }
                });
            });
        }

        $(document).ready(function() {
            $('#search-user-btn').click(searchUser);
            $('#user_id').keypress(function(e) {
                if (e.which == 13) {
                    searchUser();
                }
            });
            $('#add-credits-btn').click(addCredits);
            $('#remove-credits-btn').click(removeCredits);
        });
    </script>
@endsection
