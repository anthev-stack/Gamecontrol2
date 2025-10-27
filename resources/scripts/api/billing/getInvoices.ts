import http from '@/api/http';

export interface InvoiceItem {
    description: string;
    unit_price: number;
    quantity: number;
    total: number;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    server: {
        id: number;
        name: string;
    } | null;
    subtotal: number;
    credits_used: number;
    total: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    due_date: string;
    paid_at: string | null;
    description: string | null;
    items: InvoiceItem[];
    created_at: string;
}

export default (): Promise<Invoice[]> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/billing/invoices')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

