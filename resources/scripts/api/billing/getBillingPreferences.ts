import http from '@/api/http';

export interface BillingPreferences {
    id: number;
    user_id: number;
    auto_use_credits: boolean;
    email_invoices: boolean;
    email_payment_reminders: boolean;
}

export default (): Promise<BillingPreferences> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/billing/preferences')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

