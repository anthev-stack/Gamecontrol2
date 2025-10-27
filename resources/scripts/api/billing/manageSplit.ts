import http from '@/api/http';

export interface CreateSplitRequest {
    server_id: number;
    email: string;
    split_percentage: number;
}

export const createSplit = (data: CreateSplitRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post('/api/client/billing/splits', data)
            .then(() => resolve())
            .catch(reject);
    });
};

export const acceptSplit = (splitId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/billing/splits/${splitId}/accept`)
            .then(() => resolve())
            .catch(reject);
    });
};

export const declineSplit = (splitId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post(`/api/client/billing/splits/${splitId}/decline`)
            .then(() => resolve())
            .catch(reject);
    });
};

export const removeSplit = (splitId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.delete(`/api/client/billing/splits/${splitId}`)
            .then(() => resolve())
            .catch(reject);
    });
};

