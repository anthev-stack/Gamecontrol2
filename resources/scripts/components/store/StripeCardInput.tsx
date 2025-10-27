import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import Button from '@/components/elements/Button';
import Spinner from '@/components/elements/Spinner';

const stripePromise = loadStripe('pk_test_51SMmwa2H9A43notZSeX9iEucrC8BmhvY3AdhPOB64DocYFzM3txJWV9XCslgtR1TCMwjduoqv615ShP1mFH13RI800xa0SOj6A');

const CardElementContainer = styled.div`
    ${tw`p-4 rounded-lg`};
    background-color: rgba(0, 41, 102, 0.3);
    border: 1px solid rgba(0, 102, 255, 0.3);
    
    .StripeElement {
        padding: 12px;
        color: white;
    }
`;

interface StripeCardFormProps {
    amount: number;
    onSuccess: (paymentMethodId: string) => void;
    onError: (error: string) => void;
}

const StripeCardForm: React.FC<StripeCardFormProps> = ({ amount, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [ready, setReady] = useState(false);

    const handleCardReady = async () => {
        if (!stripe || !elements || ready) {
            return;
        }

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                onError(error.message || 'Invalid card details');
                return;
            }

            if (paymentMethod) {
                setReady(true);
                onSuccess(paymentMethod.id);
            }
        } catch (err: any) {
            onError(err.message || 'Invalid card details');
        }
    };

    return (
        <div>
            <CardElementContainer>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: 'white',
                                '::placeholder': {
                                    color: '#9ca3af',
                                },
                            },
                            invalid: {
                                color: '#ef4444',
                            },
                        },
                    }}
                    onChange={(e) => {
                        if (e.complete) {
                            handleCardReady();
                        } else {
                            setReady(false);
                            onSuccess(''); // Clear payment method if card incomplete
                        }
                    }}
                />
            </CardElementContainer>
            {ready && (
                <p css={tw`text-green-400 text-sm mt-2`}>✓ Card validated and ready</p>
            )}
        </div>
    );
};

interface StripeCardInputProps {
    amount: number;
    onSuccess: (paymentMethodId: string) => void;
    onError: (error: string) => void;
}

const StripeCardInput: React.FC<StripeCardInputProps> = ({ amount, onSuccess, onError }) => {
    return (
        <Elements stripe={stripePromise}>
            <StripeCardForm amount={amount} onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
};

export default StripeCardInput;

