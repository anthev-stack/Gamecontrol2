import http from '@/api/http';

export interface CreditTransaction {
    id: number;
    amount: number;
    dollar_value: number;
    type: string;
    description: string | null;
    admin: {
        username: string;
        email: string;
    } | null;
    created_at: string;
}

export interface CreditData {
    credits: number;
    dollar_value: number;
    transactions: CreditTransaction[];
}

export default (): Promise<CreditData> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/billing/credits')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

