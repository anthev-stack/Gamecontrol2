import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { CreditCard, Server, Check, AlertCircle, Loader } from 'lucide-react';
import { useStoreState } from 'easy-peasy';
import http from '@/api/http';
import Spinner from '@/components/elements/Spinner';
import getCredits from '@/api/billing/getCredits';

const Container = styled.div`
    ${tw`max-w-4xl mx-auto space-y-6`};
`;

const Card = styled.div`
    ${tw`p-6 rounded-lg`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.2);
`;

const Title = styled.h3`
    ${tw`text-2xl font-bold mb-6 text-white flex items-center gap-3`};
    
    svg {
        color: #0066ff;
    }
`;

const Row = styled.div`
    ${tw`flex justify-between items-center py-3 border-b`};
    border-color: rgba(0, 102, 255, 0.2);
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
    ${tw`px-6 py-3 rounded font-semibold transition-all duration-300 flex items-center justify-center gap-2`};
    ${props => props.variant === 'secondary'
        ? `
            background: transparent;
            border: 2px solid #0066ff;
            color: #0066ff;
        `
        : 'background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%); color: white;'}
    
    &:hover {
        ${props => props.variant === 'secondary'
            ? 'background: rgba(0, 102, 255, 0.1);'
            : `
                background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
            `}
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PaymentOption = styled.div<{ selected?: boolean }>`
    ${tw`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300`};
    background-color: ${props => props.selected ? 'rgba(0, 52, 204, 0.3)' : 'rgba(0, 52, 204, 0.1)'};
    border-color: ${props => props.selected ? '#0066ff' : 'rgba(0, 102, 255, 0.2)'};
    
    &:hover {
        background-color: rgba(0, 52, 204, 0.25);
        border-color: rgba(0, 102, 255, 0.4);
    }
`;

const Alert = styled.div<{ type: 'error' | 'success' | 'info' }>`
    ${tw`p-4 rounded-lg flex items-start gap-3`};
    ${props => props.type === 'error' && 'background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);'}
    ${props => props.type === 'success' && 'background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3);'}
    ${props => props.type === 'info' && 'background-color: rgba(0, 102, 255, 0.1); border: 1px solid rgba(0, 102, 255, 0.3);'}
`;

interface CartItem {
    gameType: number;
    ram: number;
    storage: number;
    slots: number;
    location: number;
}

interface EggData {
    id: number;
    name: string;
}

interface LocationData {
    id: number;
    short: string;
    long: string;
}

export default () => {
    const history = useHistory();
    const user = useStoreState((state) => state.user.data);
    
    const [cartItem, setCartItem] = useState<CartItem | null>(null);
    const [cartPrice, setCartPrice] = useState(0);
    const [egg, setEgg] = useState<EggData | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [userCredits, setUserCredits] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'credits' | 'card'>('credits');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [serverName, setServerName] = useState('');

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            history.push('/auth/login');
            return;
        }

        // Load cart data
        const storedCart = localStorage.getItem('cartItem');
        const storedPrice = localStorage.getItem('cartPrice');
        
        if (!storedCart || !storedPrice) {
            history.push('/cart');
            return;
        }

        const cart: CartItem = JSON.parse(storedCart);
        setCartItem(cart);
        setCartPrice(parseFloat(storedPrice));
        setServerName(`${user.username}'s Server`);

        // Fetch egg and location details
        Promise.all([
            http.get('/api/client/store/eggs'),
            http.get('/api/client/store/locations'),
            getCredits(),
        ])
            .then(([eggsRes, locationsRes, creditsData]) => {
                const foundEgg = eggsRes.data.find((e: EggData) => e.id === cart.gameType);
                const foundLocation = locationsRes.data.find((l: LocationData) => l.id === cart.location);
                
                setEgg(foundEgg || null);
                setLocation(foundLocation || null);
                setUserCredits(creditsData.credits);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load checkout data:', err);
                setError('Failed to load checkout information');
                setLoading(false);
            });
    }, [user, history]);

    const handlePlaceOrder = async () => {
        if (!cartItem || !egg || !location || !user) return;

        setProcessing(true);
        setError('');

        try {
            // Create the server
            const response = await http.post('/api/client/store/servers', {
                name: serverName,
                egg_id: cartItem.gameType,
                location_id: cartItem.location,
                memory: cartItem.ram * 1024, // Convert GB to MB
                disk: cartItem.storage * 1024, // Convert GB to MB
                cpu: 100, // Default CPU limit
                databases: 1,
                allocations: 1,
                backups: 0,
            });

            // Clear cart
            localStorage.removeItem('cartItem');
            localStorage.removeItem('cartPrice');

            // Redirect to server
            history.push(`/server/${response.data.attributes.identifier}`);
        } catch (err: any) {
            console.error('Failed to create server:', err);
            setError(err.response?.data?.message || 'Failed to create server. Please try again.');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <PageContentBlock title={'Checkout'} showFlashKey={'checkout'}>
                <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <Spinner size="large" />
                </div>
            </PageContentBlock>
        );
    }

    if (!cartItem || !egg || !location) {
        return (
            <PageContentBlock title={'Checkout'} showFlashKey={'checkout'}>
                <Container>
                    <Alert type="error">
                        <AlertCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <div>
                            <p css={tw`text-white font-semibold mb-1`}>Invalid Cart Data</p>
                            <p css={tw`text-neutral-300 text-sm`}>
                                Your cart is empty or invalid. Please start a new order.
                            </p>
                            <Button onClick={() => history.push('/cart')} css={tw`mt-3`}>
                                Return to Cart
                            </Button>
                        </div>
                    </Alert>
                </Container>
            </PageContentBlock>
        );
    }

    const creditsNeeded = Math.ceil(cartPrice * 10); // $1 = 10 credits
    const hasEnoughCredits = userCredits >= creditsNeeded;

    return (
        <PageContentBlock title={'Checkout'} showFlashKey={'checkout'}>
            <Container>
                {error && (
                    <Alert type="error">
                        <AlertCircle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                        <div css={tw`text-white`}>{error}</div>
                    </Alert>
                )}

                {/* Order Summary */}
                <Card>
                    <Title>
                        <Server size={24} />
                        Order Summary
                    </Title>
                    <div css={tw`space-y-3`}>
                        <Row>
                            <span css={tw`text-neutral-300`}>Game Server</span>
                            <span css={tw`text-white font-semibold`}>{egg.name}</span>
                        </Row>
                        <Row>
                            <span css={tw`text-neutral-300`}>Location</span>
                            <span css={tw`text-white font-semibold`}>{location.long}</span>
                        </Row>
                        <Row>
                            <span css={tw`text-neutral-300`}>RAM</span>
                            <span css={tw`text-white font-semibold`}>{cartItem.ram} GB</span>
                        </Row>
                        <Row>
                            <span css={tw`text-neutral-300`}>Storage</span>
                            <span css={tw`text-white font-semibold`}>{cartItem.storage} GB</span>
                        </Row>
                        <Row>
                            <span css={tw`text-neutral-300`}>Player Slots</span>
                            <span css={tw`text-white font-semibold`}>{cartItem.slots}</span>
                        </Row>
                        <Row css={tw`border-b-0 pt-4`}>
                            <span css={tw`text-neutral-300 text-lg`}>Monthly Total</span>
                            <span css={tw`text-white font-bold text-2xl`}>${cartPrice.toFixed(2)}</span>
                        </Row>
                    </div>
                </Card>

                {/* Server Name */}
                <Card>
                    <Title>Server Name</Title>
                    <input
                        type="text"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        css={tw`w-full p-3 rounded-lg text-white`}
                        style={{
                            backgroundColor: 'rgba(0, 41, 102, 0.3)',
                            border: '1px solid rgba(0, 102, 255, 0.3)',
                        }}
                        placeholder="Enter server name..."
                        maxLength={40}
                    />
                </Card>

                {/* Payment Method */}
                <Card>
                    <Title>
                        <CreditCard size={24} />
                        Payment Method
                    </Title>
                    <div css={tw`space-y-3`}>
                        <PaymentOption
                            selected={paymentMethod === 'credits'}
                            onClick={() => setPaymentMethod('credits')}
                        >
                            <div css={tw`flex items-center justify-between`}>
                                <div>
                                    <p css={tw`text-white font-semibold mb-1`}>Pay with Credits</p>
                                    <p css={tw`text-neutral-300 text-sm`}>
                                        You have {userCredits} credits (${(userCredits * 0.10).toFixed(2)})
                                    </p>
                                    {!hasEnoughCredits && (
                                        <p css={tw`text-red-400 text-sm mt-1`}>
                                            ⚠️ You need {creditsNeeded - userCredits} more credits
                                        </p>
                                    )}
                                </div>
                                {paymentMethod === 'credits' && <Check size={24} style={{ color: '#0066ff' }} />}
                            </div>
                        </PaymentOption>
                        <PaymentOption
                            selected={paymentMethod === 'card'}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <div css={tw`flex items-center justify-between`}>
                                <div>
                                    <p css={tw`text-white font-semibold mb-1`}>Credit/Debit Card</p>
                                    <p css={tw`text-neutral-300 text-sm`}>
                                        Secure payment via Stripe
                                    </p>
                                </div>
                                {paymentMethod === 'card' && <Check size={24} style={{ color: '#0066ff' }} />}
                            </div>
                        </PaymentOption>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div css={tw`flex gap-4`}>
                    <Button
                        variant="secondary"
                        onClick={() => history.push('/cart')}
                        css={tw`flex-1`}
                        disabled={processing}
                    >
                        Back to Cart
                    </Button>
                    <Button
                        onClick={handlePlaceOrder}
                        css={tw`flex-1`}
                        disabled={processing || !serverName.trim() || (paymentMethod === 'credits' && !hasEnoughCredits)}
                    >
                        {processing ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                Creating Server...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                Place Order
                            </>
                        )}
                    </Button>
                </div>

                {paymentMethod === 'credits' && !hasEnoughCredits && (
                    <Alert type="info">
                        <AlertCircle size={24} style={{ color: '#0066ff', flexShrink: 0 }} />
                        <div css={tw`text-neutral-300`}>
                            You don't have enough credits for this purchase. You can earn credits through our referral program or contact an administrator.
                        </div>
                    </Alert>
                )}
            </Container>
        </PageContentBlock>
    );
};

