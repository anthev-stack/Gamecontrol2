import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
    gameType: number;
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

interface EggData {
    id: number;
    uuid: string;
    name: string;
    description: string | null;
    nest_id: number;
    nest_name: string;
    docker_images: Record<string, string>;
}

// Game-specific pricing type definition
interface GamePricing {
    base: number;
    ramPerGB: number;
    storagePerGB: number;
    slotsPer10: number;
    pricePerSlot?: number;
    pricingModel: 'resource' | 'slot' | 'hybrid';
}

// Game-specific pricing configurations based on industry standards
const GAME_PRICING: Record<string, GamePricing> = {
    // Minecraft - Slot-based pricing (most common)
    'minecraft': {
        base: 0,
        ramPerGB: 0,
        storagePerGB: 0,
        slotsPer10: 0,
        pricePerSlot: 0.50, // $0.50 per player slot
        pricingModel: 'slot',
    },
    // Rust - High resource needs, flat resource pricing
    'rust': {
        base: 8,
        ramPerGB: 2.5,
        storagePerGB: 0.30,
        slotsPer10: 0,
        pricingModel: 'resource',
    },
    // Counter-Strike (CS:GO, CS2) - Slot-based with base
    'counter-strike': {
        base: 5,
        ramPerGB: 1.5,
        storagePerGB: 0.20,
        slotsPer10: 0,
        pricePerSlot: 0.30,
        pricingModel: 'hybrid',
    },
    'cs:go': {
        base: 5,
        ramPerGB: 1.5,
        storagePerGB: 0.20,
        slotsPer10: 0,
        pricePerSlot: 0.30,
        pricingModel: 'hybrid',
    },
    'csgo': {
        base: 5,
        ramPerGB: 1.5,
        storagePerGB: 0.20,
        slotsPer10: 0,
        pricePerSlot: 0.30,
        pricingModel: 'hybrid',
    },
    // ARK - Very resource intensive
    'ark': {
        base: 12,
        ramPerGB: 3,
        storagePerGB: 0.50,
        slotsPer10: 0,
        pricingModel: 'resource',
    },
    // Valheim - Medium requirements
    'valheim': {
        base: 6,
        ramPerGB: 2,
        storagePerGB: 0.25,
        slotsPer10: 0.50,
        pricingModel: 'resource',
    },
    // Terraria - Light requirements
    'terraria': {
        base: 3,
        ramPerGB: 1,
        storagePerGB: 0.15,
        slotsPer10: 0.25,
        pricingModel: 'resource',
    },
    // Garry's Mod - Source engine
    'gmod': {
        base: 4,
        ramPerGB: 1.5,
        storagePerGB: 0.20,
        slotsPer10: 0,
        pricePerSlot: 0.25,
        pricingModel: 'hybrid',
    },
    "garry's mod": {
        base: 4,
        ramPerGB: 1.5,
        storagePerGB: 0.20,
        slotsPer10: 0,
        pricePerSlot: 0.25,
        pricingModel: 'hybrid',
    },
    // Default fallback pricing
    'default': {
        base: 5,
        ramPerGB: 2,
        storagePerGB: 0.40,
        slotsPer10: 0.50,
        pricingModel: 'resource',
    },
};

export default () => {
    const history = useHistory();
    const location = useLocation();
    const user = useStoreState((state) => state.user.data);
    
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const preselectedGame = searchParams.get('game');
    const preselectedRam = searchParams.get('ram');
    const preselectedStorage = searchParams.get('storage');
    
    const [gameType, setGameType] = useState<number | null>(null);
    const [ram, setRam] = useState(preselectedRam ? parseInt(preselectedRam) : 2);
    const [storage, setStorage] = useState(preselectedStorage ? parseInt(preselectedStorage) : 5);
    const [slots, setSlots] = useState(20);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [eggs, setEggs] = useState<EggData[]>([]);
    const [loading, setLoading] = useState(true);
    const [canCheckout, setCanCheckout] = useState(false);
    const [maxRam, setMaxRam] = useState(32);
    const [maxStorage, setMaxStorage] = useState(100);
    
    useEffect(() => {
        // Fetch real locations and eggs from public API (no auth required)
        Promise.all([
            http.get('/api/public/store/locations'),
            http.get('/api/public/store/eggs'),
        ])
            .then(([locationsRes, eggsRes]) => {
                setLocations(locationsRes.data.data);
                setEggs(eggsRes.data.data);
                
                // Auto-select first available location
                const firstAvailable = locationsRes.data.data.find((loc: LocationData) => loc.available);
                if (firstAvailable) {
                    setSelectedLocation(firstAvailable.id);
                    updateMaxResources(firstAvailable);
                }
                
                // Check if there's a preselected game from URL
                if (preselectedGame && eggsRes.data.data.length > 0) {
                    // Try to find egg by name (case-insensitive partial match)
                    const matchedEgg = eggsRes.data.data.find((egg: EggData) => 
                        egg.name.toLowerCase().includes(preselectedGame.toLowerCase())
                    );
                    if (matchedEgg) {
                        setGameType(matchedEgg.id);
                    } else {
                        // Fallback to first egg
                        setGameType(eggsRes.data.data[0].id);
                    }
                } else if (eggsRes.data.data.length > 0) {
                    // Auto-select first egg if no preselection
                    setGameType(eggsRes.data.data[0].id);
                }
                
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            });
    }, []);
    
    const updateMaxResources = (loc: LocationData) => {
        // Set max RAM and storage based on location's available capacity
        const maxAvailableRam = Math.floor(loc.capacity.memory.available / 1024);
        const maxAvailableStorage = Math.floor(loc.capacity.disk.available / 1024);
        
        setMaxRam(Math.min(maxAvailableRam, 32)); // Cap at 32GB
        setMaxStorage(Math.min(maxAvailableStorage, 100)); // Cap at 100GB
        
        // Adjust current values if they exceed new max
        if (ram > maxAvailableRam) {
            setRam(Math.min(2, maxAvailableRam));
        }
        if (storage > maxAvailableStorage) {
            setStorage(Math.min(5, maxAvailableStorage));
        }
    };
    
    useEffect(() => {
        // Update max resources when location changes
        if (selectedLocation !== null) {
            const loc = locations.find(l => l.id === selectedLocation);
            if (loc) {
                updateMaxResources(loc);
            }
        }
    }, [selectedLocation]);
    
    useEffect(() => {
        // Check if selected location can accommodate the configuration
        if (selectedLocation !== null) {
            http.post(`/api/client/store/locations/${selectedLocation}/check`, {
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
    }, [selectedLocation, ram, storage]);
    
    const getPricingForGame = (egg: EggData | undefined): GamePricing => {
        if (!egg) return GAME_PRICING['default'];
        
        // Try to match game name to pricing config
        const gameName = egg.name.toLowerCase();
        
        // Check for exact or partial matches
        for (const [key, pricing] of Object.entries(GAME_PRICING)) {
            if (gameName.includes(key.toLowerCase())) {
                return pricing;
            }
        }
        
        return GAME_PRICING['default'];
    };
    
    const calculatePrice = () => {
        const selectedEgg = eggs.find(egg => egg.id === gameType);
        const pricing = getPricingForGame(selectedEgg);
        
        let totalPrice = pricing.base;
        
        // Add resource costs
        if (pricing.pricingModel === 'resource' || pricing.pricingModel === 'hybrid') {
            totalPrice += ram * pricing.ramPerGB;
            totalPrice += storage * pricing.storagePerGB;
            totalPrice += Math.floor(slots / 10) * pricing.slotsPer10;
        }
        
        // Add slot-based costs
        if (pricing.pricingModel === 'slot' || pricing.pricingModel === 'hybrid') {
            if (pricing.pricePerSlot) {
                totalPrice += slots * pricing.pricePerSlot;
            }
        }
        
        return Math.max(totalPrice, 1); // Minimum $1/month
    };
    
    const monthlyPrice = calculatePrice();
    
    const handleCheckout = () => {
        if (!user) {
            history.push('/auth/login');
            return;
        }
        
        if (gameType === null || selectedLocation === null) {
            return;
        }
        
        // Store cart data in localStorage
        const cartItem: CartItem = {
            gameType,
            ram,
            storage,
            slots,
            location: selectedLocation,
        };
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
        localStorage.setItem('cartPrice', monthlyPrice.toString());
        
        history.push('/checkout');
    };
    
    const selectedEgg = eggs.find(egg => egg.id === gameType);
    const currentPricing = getPricingForGame(selectedEgg);

    return (
        <PageContentBlock title={'Order Server'} showFlashKey={'cart'}>
            <Container>
                <Card>
                    <Title>
                        <Server size={32} />
                        Configure Your Server
                    </Title>
                    
                    {/* Pricing Model Info */}
                    {selectedEgg && (
                        <div css={tw`mb-4 p-3 rounded-lg`} style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', border: '1px solid rgba(0, 102, 255, 0.3)' }}>
                            <p css={tw`text-sm text-neutral-300`}>
                                <strong css={tw`text-white`}>Pricing Model:</strong>{' '}
                                {currentPricing.pricingModel === 'slot' && 'Per Player Slot'}
                                {currentPricing.pricingModel === 'resource' && 'Resource-Based'}
                                {currentPricing.pricingModel === 'hybrid' && 'Base + Resources + Slots'}
                                {currentPricing.pricePerSlot && ` ($${currentPricing.pricePerSlot.toFixed(2)} per slot)`}
                            </p>
                        </div>
                    )}
                    
                    {/* Game Type Selection */}
                    <Label>SELECT GAME TYPE</Label>
                    {loading ? (
                        <div css={tw`flex justify-center py-12`}>
                            <Spinner size="large" />
                        </div>
                    ) : (
                        <div css={tw`mb-6`}>
                            <select
                                value={gameType || ''}
                                onChange={(e) => setGameType(parseInt(e.target.value))}
                                css={tw`w-full p-4 rounded-lg text-white font-semibold text-lg`}
                                style={{
                                    backgroundColor: 'rgba(0, 52, 204, 0.3)',
                                    border: '2px solid rgba(0, 102, 255, 0.4)',
                                }}
                            >
                                <option value="" disabled>Choose a game server...</option>
                                {eggs.map(egg => (
                                    <option key={egg.id} value={egg.id} style={{ backgroundColor: '#001433', color: 'white' }}>
                                        {egg.name} {egg.nest_name && `(${egg.nest_name})`}
                                    </option>
                                ))}
                            </select>
                            {selectedEgg && selectedEgg.description && (
                                <p css={tw`mt-2 text-sm text-neutral-400`}>{selectedEgg.description}</p>
                            )}
                        </div>
                    )}
                    
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
                                max={maxRam}
                                value={ram}
                                onChange={(e) => setRam(parseInt(e.target.value))}
                            />
                            <div css={tw`text-xs text-neutral-400 mt-1`}>
                                {currentPricing.ramPerGB > 0 ? `$${currentPricing.ramPerGB.toFixed(2)} / GB` : 'Included'}
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
                                max={maxStorage}
                                step="5"
                                value={storage}
                                onChange={(e) => setStorage(parseInt(e.target.value))}
                            />
                            <div css={tw`text-xs text-neutral-400 mt-1`}>
                                {currentPricing.storagePerGB > 0 ? `$${currentPricing.storagePerGB.toFixed(2)} / GB` : 'Included'}
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
                                {currentPricing.pricePerSlot 
                                    ? `$${currentPricing.pricePerSlot.toFixed(2)} / slot` 
                                    : currentPricing.slotsPer10 > 0 
                                        ? `$${currentPricing.slotsPer10.toFixed(2)} / 10 slots`
                                        : 'Included'
                                }
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
                                    selected={selectedLocation === loc.id}
                                    disabled={!loc.available}
                                    onClick={() => loc.available && setSelectedLocation(loc.id)}
                                >
                                    <div css={tw`flex items-center justify-between mb-3`}>
                                        <div>
                                            <div css={tw`text-white font-bold text-lg mb-1`}>{loc.short}</div>
                                            <div css={tw`text-neutral-400 text-sm`}>{loc.long}</div>
                                        </div>
                                        {loc.available ? (
                                            <CheckCircle size={24} style={{ color: selectedLocation === loc.id ? '#0066ff' : '#22c55e' }} />
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
                    {currentPricing.base > 0 && (
                        <PriceRow>
                            <span css={tw`text-neutral-300`}>Base Price</span>
                            <span css={tw`text-white font-semibold`}>${currentPricing.base.toFixed(2)}</span>
                        </PriceRow>
                    )}
                    {currentPricing.ramPerGB > 0 && (
                        <PriceRow>
                            <span css={tw`text-neutral-300`}>RAM ({ram} GB)</span>
                            <span css={tw`text-white font-semibold`}>${(ram * currentPricing.ramPerGB).toFixed(2)}</span>
                        </PriceRow>
                    )}
                    {currentPricing.storagePerGB > 0 && (
                        <PriceRow>
                            <span css={tw`text-neutral-300`}>Storage ({storage} GB)</span>
                            <span css={tw`text-white font-semibold`}>${(storage * currentPricing.storagePerGB).toFixed(2)}</span>
                        </PriceRow>
                    )}
                    {currentPricing.pricePerSlot ? (
                        <PriceRow css={tw`border-b-0`}>
                            <span css={tw`text-neutral-300`}>Player Slots ({slots})</span>
                            <span css={tw`text-white font-semibold`}>${(slots * currentPricing.pricePerSlot).toFixed(2)}</span>
                        </PriceRow>
                    ) : currentPricing.slotsPer10 > 0 && (
                        <PriceRow css={tw`border-b-0`}>
                            <span css={tw`text-neutral-300`}>Player Slots ({slots})</span>
                            <span css={tw`text-white font-semibold`}>${(Math.floor(slots / 10) * currentPricing.slotsPer10).toFixed(2)}</span>
                        </PriceRow>
                    )}
                    <div css={tw`mt-4 pt-4 border-t`} style={{ borderColor: 'rgba(0, 102, 255, 0.3)' }}>
                        <div css={tw`flex justify-between items-center mb-2`}>
                            <span css={tw`text-neutral-300 text-sm`}>Monthly Total</span>
                            <TotalPrice>${monthlyPrice.toFixed(2)}/mo</TotalPrice>
                        </div>
                    </div>
                    <Button 
                        onClick={handleCheckout} 
                        css={tw`w-full mt-6 justify-center`}
                        disabled={!canCheckout || selectedLocation === null}
                    >
                        <ShoppingCart size={20} />
                        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </Button>
                    {!canCheckout && selectedLocation !== null && (
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

