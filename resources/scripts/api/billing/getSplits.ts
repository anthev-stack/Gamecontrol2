import http from '@/api/http';

export interface SplitData {
    id: number;
    server: {
        id: number;
        name: string;
        uuid: string;
    };
    inviter?: {
        username: string;
        email: string;
    };
    participant?: {
        username: string;
        email: string;
    };
    split_percentage: number;
    status: 'pending' | 'active' | 'declined' | 'removed';
    created_at: string;
}

export interface SplitsResponse {
    participating: SplitData[];
    sent: SplitData[];
}

export default (): Promise<SplitsResponse> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/billing/splits')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};

