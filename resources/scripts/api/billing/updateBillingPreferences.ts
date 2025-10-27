import http from '@/api/http';

export interface UpdateBillingPreferencesRequest {
    auto_use_credits?: boolean;
    email_invoices?: boolean;
    email_payment_reminders?: boolean;
}

export default (data: UpdateBillingPreferencesRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.put('/api/client/billing/preferences', data)
            .then(() => resolve())
            .catch(reject);
    });
};

