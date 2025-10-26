import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import register from '@/api/auth/register';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string, ref } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';

interface Values {
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
}

const RegisterContainer = ({ history }: RouteComponentProps) => {
    const recaptchaRef = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            recaptchaRef.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        register({ ...values, recaptchaData: token })
            .then(() => {
                // @ts-expect-error this is valid
                window.location = '/auth/login?registered=true';
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (recaptchaRef.current) recaptchaRef.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ email: '', username: '', password: '', passwordConfirmation: '' }}
            validationSchema={object().shape({
                email: string().email('A valid email must be provided.').required('An email address is required.'),
                username: string()
                    .required('A username must be provided.')
                    .min(3, 'Username must be at least 3 characters.')
                    .max(32, 'Username must not exceed 32 characters.'),
                password: string()
                    .required('Please enter a password.')
                    .min(8, 'Password must be at least 8 characters.'),
                passwordConfirmation: string()
                    .required('Please confirm your password.')
                    .oneOf([ref('password')], 'Passwords must match.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={'Create Account'} css={tw`w-full flex`}>
                    <Field light type={'email'} label={'Email Address'} name={'email'} disabled={isSubmitting} />
                    <div css={tw`mt-6`}>
                        <Field light type={'text'} label={'Username'} name={'username'} disabled={isSubmitting} />
                    </div>
                    <div css={tw`mt-6`}>
                        <Field
                            light
                            type={'password'}
                            label={'Password'}
                            name={'password'}
                            disabled={isSubmitting}
                            description={'Must be at least 8 characters'}
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Field
                            light
                            type={'password'}
                            label={'Confirm Password'}
                            name={'passwordConfirmation'}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            Create Account
                        </Button>
                    </div>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={recaptchaRef}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    <div css={tw`mt-6 text-center`}>
                        <p css={tw`text-xs text-neutral-500 mb-2`}>Already have an account?</p>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs tracking-wide no-underline uppercase hover:text-neutral-600`}
                            style={{
                                background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 600,
                            }}
                        >
                            Login Here
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default RegisterContainer;

