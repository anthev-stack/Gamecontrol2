import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { Server, HardDrive, Users, MapPin, ShoppingCart, Trash2, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { useStoreState } from 'easy-peasy';
import http from '@/api/http';
import Spinner from '@/components/elements/Spinner';

const Container = styled.div`
    ${tw`space-y-6`};
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

const Grid = styled.div`
    ${tw`grid md:grid-cols-2 gap-6`};
`;

const OptionCard = styled.div<{ selected?: boolean; disabled?: boolean }>`
    ${tw`p-4 rounded-lg transition-all duration-300 border-2`};
    background-color: ${props => props.disabled ? 'rgba(100, 100, 100, 0.1)' : props.selected ? 'rgba(0, 52, 204, 0.3)' : 'rgba(0, 52, 204, 0.1)'};
    border-color: ${props => props.disabled ? 'rgba(100, 100, 100, 0.2)' : props.selected ? '#0066ff' : 'rgba(0, 102, 255, 0.2)'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1};
    
    &:hover {
        background-color: ${props => props.disabled ? 'rgba(100, 100, 100, 0.1)' : 'rgba(0, 52, 204, 0.25)'};
        border-color: ${props => props.disabled ? 'rgba(100, 100, 100, 0.2)' : 'rgba(0, 102, 255, 0.4)'};
    }
`;

const Label = styled.div`
    ${tw`text-sm text-neutral-400 mb-2`};
`;

const ConfigGrid = styled.div`
    ${tw`grid grid-cols-3 gap-4 mb-6`};
`;

const ConfigCard = styled.div`
    ${tw`p-4 rounded-lg`};
    background-color: rgba(0, 41, 102, 0.3);
    border: 1px solid rgba(0, 102, 255, 0.3);
`;

const Slider = styled.input`
    ${tw`w-full`};
    
    &[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(90deg, #0052cc 0%, #0066ff 100%);
        outline: none;
        
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #0066ff;
            cursor: pointer;
            border: 2px solid white;
        }
        
        &::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #0066ff;
            cursor: pointer;
            border: 2px solid white;
        }
    }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
    ${tw`px-6 py-3 rounded font-semibold transition-all duration-300 flex items-center gap-2`};
    ${props => props.variant === 'danger' 
        ? 'background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);' 
        : 'background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);'}
    color: white;
    
    &:hover {
        ${props => props.variant === 'danger'
            ? 'background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);'
            : 'background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);'}
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PriceCard = styled.div`
    ${tw`p-6 rounded-lg sticky top-6`};
    background: linear-gradient(135deg, rgba(0, 52, 204, 0.3) 0%, rgba(0, 102, 255, 0.2) 100%);
    border: 2px solid rgba(0, 102, 255, 0.4);
`;

const PriceRow = styled.div`
    ${tw`flex justify-between items-center py-2 border-b`};
    border-color: rgba(0, 102, 255, 0.2);
`;

const TotalPrice = styled.div`
    ${tw`text-4xl font-bold mt-4`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

interface CartItem {
    gameType: string;
    ram: number;
    storage: number;
    slots: number;
    location: number;
}

interface LocationData {
    id: number;
    short: string;
    long: string;
    available: boolean;
    reason?: string;
    capacity: {
        memory: {
            total: number;
            used: number;
            available: number;
            percentage: number;
        };
        disk: {
            total: number;
            used: number;
            available: number;
            percentage: number;
        };
    };
    node_count: number;
}

const PRICING = {
    base: 5,
    ramPerGB: 2,
    storagePerGB: 0.5,
    slotsPer10: 1,
};

const GAMES = [
    { id: 'minecraft', name: 'Minecraft', icon: '🎮', description: 'Java & Bedrock Edition' },
    { id: 'cs2', name: 'Counter-Strike 2', icon: '🔫', description: 'Competitive FPS' },
    { id: 'rust', name: 'Rust', icon: '🏚️', description: 'Survival Game' },
    { id: 'valheim', name: 'Valheim', icon: '⚔️', description: 'Viking Survival' },
];

export default () => {
    const history = useHistory();
    const user = useStoreState((state) => state.user.data);
    
    const [gameType, setGameType] = useState('minecraft');
    const [ram, setRam] = useState(2);
    const [storage, setStorage] = useState(5);
    const [slots, setSlots] = useState(20);
    const [location, setLocation] = useState<number | null>(null);
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [canCheckout, setCanCheckout] = useState(false);
    
    useEffect(() => {
        // Fetch real locations from API
        http.get('/api/client/store/locations')
            .then(({ data }) => {
                setLocations(data.data);
                // Auto-select first available location
                const firstAvailable = data.data.find((loc: LocationData) => loc.available);
                if (firstAvailable) {
                    setLocation(firstAvailable.id);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch locations:', error);
                setLoading(false);
            });
    }, []);
    
    useEffect(() => {
        // Check if selected location can accommodate the configuration
        if (location !== null) {
            http.post(`/api/client/store/locations/${location}/check`, {
                ram,
                storage,
            })
                .then(({ data }) => {
                    setCanCheckout(data.available);
                })
                .catch(() => {
                    setCanCheckout(false);
                });
        }
    }, [location, ram, storage]);
    
    const calculatePrice = () => {
        const ramCost = ram * PRICING.ramPerGB;
        const storageCost = storage * PRICING.storagePerGB;
        const slotsCost = Math.floor(slots / 10) * PRICING.slotsPer10;
        return PRICING.base + ramCost + storageCost + slotsCost;
    };
    
    const monthlyPrice = calculatePrice();
    
    const handleCheckout = () => {
        if (!user) {
            history.push('/auth/login');
            return;
        }
        
        // Store cart data in localStorage
        const cartItem: CartItem = {
            gameType,
            ram,
            storage,
            slots,
            location,
        };
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
        localStorage.setItem('cartPrice', monthlyPrice.toString());
        
        history.push('/checkout');
    };

    return (
        <PageContentBlock title={'Order Server'} showFlashKey={'cart'}>
            <Container>
                <Card>
                    <Title>
                        <Server size={32} />
                        Configure Your Server
                    </Title>
                    
                    {/* Game Type Selection */}
                    <Label>SELECT GAME TYPE</Label>
                    <Grid css={tw`mb-6`}>
                        {GAMES.map(game => (
                            <OptionCard
                                key={game.id}
                                selected={gameType === game.id}
                                onClick={() => setGameType(game.id)}
                            >
                                <div css={tw`text-3xl mb-2`}>{game.icon}</div>
                                <div css={tw`text-white font-bold text-lg`}>{game.name}</div>
                                <div css={tw`text-neutral-400 text-sm`}>{game.description}</div>
                            </OptionCard>
                        ))}
                    </Grid>
                    
                    {/* Server Configuration */}
                    <Label>SERVER RESOURCES</Label>
                    <ConfigGrid>
                        <ConfigCard>
                            <div css={tw`flex items-center gap-2 mb-3`}>
                                <HardDrive size={20} style={{ color: '#0066ff' }} />
                                <span css={tw`text-white font-semibold`}>RAM</span>
                            </div>
                            <div css={tw`text-3xl font-bold text-white mb-2`}>{ram} GB</div>
                            <Slider
                                type="range"
                                min="1"
                                max="32"
                                value={ram}
                                onChange={(e) => setRam(parseInt(e.target.value))}
                            />
                            <div css={tw`text-xs text-neutral-400 mt-1`}>
                                ${PRICING.ramPerGB} / GB
                            </div>
                        </ConfigCard>
                        
                        <ConfigCard>
                            <div css={tw`flex items-center gap-2 mb-3`}>
                                <HardDrive size={20} style={{ color: '#0066ff' }} />
                                <span css={tw`text-white font-semibold`}>Storage</span>
                            </div>
                            <div css={tw`text-3xl font-bold text-white mb-2`}>{storage} GB</div>
                            <Slider
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={storage}
                                onChange={(e) => setStorage(parseInt(e.target.value))}
                            />
                            <div css={tw`text-xs text-neutral-400 mt-1`}>
                                ${PRICING.storagePerGB} / GB
                            </div>
                        </ConfigCard>
                        
                        <ConfigCard>
                            <div css={tw`flex items-center gap-2 mb-3`}>
                                <Users size={20} style={{ color: '#0066ff' }} />
                                <span css={tw`text-white font-semibold`}>Player Slots</span>
                            </div>
                            <div css={tw`text-3xl font-bold text-white mb-2`}>{slots}</div>
                            <Slider
                                type="range"
                                min="10"
                                max="200"
                                step="10"
                                value={slots}
                                onChange={(e) => setSlots(parseInt(e.target.value))}
                            />
                            <div css={tw`text-xs text-neutral-400 mt-1`}>
                                ${PRICING.slotsPer10} / 10 slots
                            </div>
                        </ConfigCard>
                    </ConfigGrid>
                    
                    {/* Location Selection */}
                    <Label>SELECT LOCATION</Label>
                    {loading ? (
                        <div css={tw`flex justify-center py-12`}>
                            <Spinner size="large" />
                        </div>
                    ) : (
                        <Grid>
                            {locations.map(loc => (
                                <OptionCard
                                    key={loc.id}
                                    selected={location === loc.id}
                                    disabled={!loc.available}
                                    onClick={() => loc.available && setLocation(loc.id)}
                                >
                                    <div css={tw`flex items-center justify-between mb-3`}>
                                        <div>
                                            <div css={tw`text-white font-bold text-lg mb-1`}>{loc.short}</div>
                                            <div css={tw`text-neutral-400 text-sm`}>{loc.long}</div>
                                        </div>
                                        {loc.available ? (
                                            <CheckCircle size={24} style={{ color: location === loc.id ? '#0066ff' : '#22c55e' }} />
                                        ) : (
                                            <AlertCircle size={24} style={{ color: '#ef4444' }} />
                                        )}
                                    </div>
                                    {loc.available ? (
                                        <div css={tw`space-y-1`}>
                                            <div css={tw`flex justify-between text-xs`}>
                                                <span css={tw`text-neutral-400`}>RAM</span>
                                                <span css={tw`text-neutral-300`}>
                                                    {Math.floor(loc.capacity.memory.available / 1024)} GB free
                                                </span>
                                            </div>
                                            <div css={tw`flex justify-between text-xs`}>
                                                <span css={tw`text-neutral-400`}>Storage</span>
                                                <span css={tw`text-neutral-300`}>
                                                    {Math.floor(loc.capacity.disk.available / 1024)} GB free
                                                </span>
                                            </div>
                                            <div css={tw`flex justify-between text-xs`}>
                                                <span css={tw`text-neutral-400`}>Nodes</span>
                                                <span css={tw`text-neutral-300`}>{loc.node_count} active</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div css={tw`text-red-400 text-xs`}>{loc.reason}</div>
                                    )}
                                </OptionCard>
                            ))}
                        </Grid>
                    )}
                </Card>
                
                {/* Price Summary */}
                <PriceCard>
                    <div css={tw`text-white font-bold text-xl mb-4`}>Order Summary</div>
                    <PriceRow>
                        <span css={tw`text-neutral-300`}>Base Price</span>
                        <span css={tw`text-white font-semibold`}>${PRICING.base.toFixed(2)}</span>
                    </PriceRow>
                    <PriceRow>
                        <span css={tw`text-neutral-300`}>RAM ({ram} GB)</span>
                        <span css={tw`text-white font-semibold`}>${(ram * PRICING.ramPerGB).toFixed(2)}</span>
                    </PriceRow>
                    <PriceRow>
                        <span css={tw`text-neutral-300`}>Storage ({storage} GB)</span>
                        <span css={tw`text-white font-semibold`}>${(storage * PRICING.storagePerGB).toFixed(2)}</span>
                    </PriceRow>
                    <PriceRow css={tw`border-b-0`}>
                        <span css={tw`text-neutral-300`}>Player Slots ({slots})</span>
                        <span css={tw`text-white font-semibold`}>${(Math.floor(slots / 10) * PRICING.slotsPer10).toFixed(2)}</span>
                    </PriceRow>
                    <div css={tw`mt-4 pt-4 border-t`} style={{ borderColor: 'rgba(0, 102, 255, 0.3)' }}>
                        <div css={tw`flex justify-between items-center mb-2`}>
                            <span css={tw`text-neutral-300 text-sm`}>Monthly Total</span>
                            <TotalPrice>${monthlyPrice.toFixed(2)}/mo</TotalPrice>
                        </div>
                    </div>
                    <Button 
                        onClick={handleCheckout} 
                        css={tw`w-full mt-6 justify-center`}
                        disabled={!canCheckout || location === null}
                    >
                        <ShoppingCart size={20} />
                        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </Button>
                    {!canCheckout && location !== null && (
                        <p css={tw`text-xs text-center text-red-400 mt-3`}>
                            ⚠️ Selected location doesn't have enough resources for this configuration
                        </p>
                    )}
                    {!user && (
                        <p css={tw`text-xs text-center text-neutral-400 mt-3`}>
                            You'll need to sign in or create an account to complete your order
                        </p>
                    )}
                </PriceCard>
            </Container>
        </PageContentBlock>
    );
};

