import http from '@/api/http';

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
    recaptchaData?: string;
}

export default ({ email, username, password, passwordConfirmation, recaptchaData }: RegisterData): Promise<void> => {
    return new Promise((resolve, reject) => {
        http.post('/auth/register', {
            email,
            username,
            password,
            password_confirmation: passwordConfirmation,
            'g-recaptcha-response': recaptchaData,
        })
            .then(() => resolve())
            .catch(reject);
    });
};

