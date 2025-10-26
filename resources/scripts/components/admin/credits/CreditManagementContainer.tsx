import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { DollarSign, Plus, Minus, Search } from 'lucide-react';
import http from '@/api/http';

const Container = styled.div`
    ${tw`p-6 space-y-6`};
    background-color: #000a1a;
    min-height: 100vh;
`;

const Card = styled.div`
    ${tw`p-6 rounded-lg`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.2);
`;

const Title = styled.h1`
    ${tw`text-3xl font-bold mb-6 text-white flex items-center gap-3`};
    
    svg {
        color: #0066ff;
    }
`;

const Input = styled.input`
    ${tw`w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-blue-500 focus:outline-none`};
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
    ${tw`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2`};
    
    ${props => props.variant === 'primary' && `
        background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
        color: white;
        &:hover {
            background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
        }
    `}
    
    ${props => props.variant === 'success' && `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        &:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-1px);
        }
    `}
    
    ${props => props.variant === 'danger' && `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        &:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-1px);
        }
    `}
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const UserCard = styled.div`
    ${tw`p-4 rounded-lg mb-4`};
    background-color: rgba(0, 52, 204, 0.2);
    border: 1px solid rgba(0, 102, 255, 0.3);
`;

const Label = styled.label`
    ${tw`block text-sm font-semibold text-neutral-300 mb-2`};
`;

const Select = styled.select`
    ${tw`w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-blue-500 focus:outline-none`};
`;

const TextArea = styled.textarea`
    ${tw`w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:border-blue-500 focus:outline-none`};
`;

const Alert = styled.div<{ type: 'success' | 'error' }>`
    ${tw`p-4 rounded-lg mb-4`};
    ${props => props.type === 'success' && tw`bg-green-900 text-green-200 border border-green-700`};
    ${props => props.type === 'error' && tw`bg-red-900 text-red-200 border border-red-700`};
`;

export default () => {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('admin_grant');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const searchUser = async () => {
        if (!userId) return;
        
        setLoading(true);
        setMessage(null);
        
        try {
            const { data } = await http.get(`/api/application/users/${userId}/credits`);
            setUser(data);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load user' });
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const addCredits = async () => {
        if (!user || !amount) return;
        
        setLoading(true);
        setMessage(null);
        
        try {
            const { data } = await http.post(`/api/application/users/${user.user.id}/credits`, {
                amount: parseInt(amount),
                type,
                description: description || null,
            });
            
            setMessage({ type: 'success', text: data.message });
            setAmount('');
            setDescription('');
            
            // Refresh user data
            await searchUser();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add credits' });
        } finally {
            setLoading(false);
        }
    };

    const removeCredits = async () => {
        if (!user || !amount) return;
        
        if (!confirm(`Remove ${amount} credits from ${user.user.username}?`)) return;
        
        setLoading(true);
        setMessage(null);
        
        try {
            const { data } = await http.delete(`/api/application/users/${user.user.id}/credits`, {
                data: {
                    amount: parseInt(amount),
                    description: description || null,
                },
            });
            
            setMessage({ type: 'success', text: data.message });
            setAmount('');
            setDescription('');
            
            // Refresh user data
            await searchUser();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to remove credits' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>
                <DollarSign size={32} />
                Credit Management
            </Title>

            {message && (
                <Alert type={message.type}>
                    {message.text}
                </Alert>
            )}

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Search User</h2>
                <div className="flex gap-4">
                    <Input 
                        type="number" 
                        placeholder="Enter User ID" 
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchUser()}
                    />
                    <Button variant="primary" onClick={searchUser} disabled={loading}>
                        <Search size={20} />
                        Search
                    </Button>
                </div>
            </Card>

            {user && (
                <>
                    <Card>
                        <h2 className="text-xl font-bold text-white mb-4">User Information</h2>
                        <UserCard>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-neutral-400 text-sm">Username</p>
                                    <p className="text-white font-bold text-lg">{user.user.username}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm">Email</p>
                                    <p className="text-white font-bold text-lg">{user.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm">User ID</p>
                                    <p className="text-white font-bold text-lg">{user.user.id}</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-700">
                                <div>
                                    <p className="text-neutral-400 text-sm mb-1">Current Credits</p>
                                    <p className="text-4xl font-bold text-white">{user.credits}</p>
                                </div>
                                <div>
                                    <p className="text-neutral-400 text-sm mb-1">Dollar Value</p>
                                    <p className="text-4xl font-bold" style={{ color: '#0066ff' }}>
                                        ${user.dollar_value.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </UserCard>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-white mb-4">Manage Credits</h2>
                        <div className="space-y-4">
                            <div>
                                <Label>Amount (Credits)</Label>
                                <Input 
                                    type="number" 
                                    placeholder="Enter credit amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="1"
                                />
                                <p className="text-sm text-neutral-400 mt-1">
                                    {amount && `≈ $${(parseInt(amount) * 0.10).toFixed(2)}`}
                                </p>
                            </div>

                            <div>
                                <Label>Type</Label>
                                <Select value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="admin_grant">Admin Grant</option>
                                    <option value="giveaway">Giveaway</option>
                                    <option value="referral">Referral Bonus</option>
                                    <option value="payment">Payment Refund</option>
                                </Select>
                            </div>

                            <div>
                                <Label>Description (Optional)</Label>
                                <TextArea 
                                    rows={3}
                                    placeholder="Enter reason for credit adjustment..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    variant="success" 
                                    onClick={addCredits}
                                    disabled={loading || !amount}
                                >
                                    <Plus size={20} />
                                    Add Credits
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={removeCredits}
                                    disabled={loading || !amount}
                                >
                                    <Minus size={20} />
                                    Remove Credits
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
                        <div className="space-y-2">
                            {user.transactions && user.transactions.length > 0 ? (
                                user.transactions.map((transaction: any) => (
                                    <div 
                                        key={transaction.id}
                                        className="p-4 rounded-lg flex items-center justify-between"
                                        style={{ backgroundColor: 'rgba(0, 41, 102, 0.3)', border: '1px solid rgba(0, 102, 255, 0.2)' }}
                                    >
                                        <div>
                                            <p className="text-white font-semibold capitalize">
                                                {transaction.type.replace('_', ' ')}
                                            </p>
                                            <p className="text-sm text-neutral-400">
                                                {transaction.description || 'No description'}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {new Date(transaction.created_at).toLocaleString()}
                                                {transaction.admin && ` • by ${transaction.admin.username}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                            </p>
                                            <p className="text-sm text-neutral-400">
                                                {transaction.amount > 0 ? '+' : ''}${transaction.dollar_value.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-neutral-500 py-8">No transactions yet</p>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </Container>
    );
};

