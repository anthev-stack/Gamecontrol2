import React, { useState, useEffect } from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import { CreditCard, Download, DollarSign, Calendar, CheckCircle, Clock, Users } from 'lucide-react';
import getCredits, { CreditData } from '@/api/billing/getCredits';
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

const CardTitle = styled.h3`
    ${tw`text-xl font-bold mb-4 text-white flex items-center gap-3`};
    
    svg {
        color: #0066ff;
    }
`;

const Grid = styled.div`
    ${tw`grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6`};
`;

const StatCard = styled.div`
    ${tw`p-4 rounded-lg text-center`};
    background-color: rgba(0, 52, 204, 0.2);
    border: 1px solid rgba(0, 102, 255, 0.3);
`;

const StatValue = styled.div`
    ${tw`text-3xl font-bold mb-1`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const StatLabel = styled.div`
    ${tw`text-sm text-neutral-400`};
`;

const Table = styled.table`
    ${tw`w-full`};
`;

const Th = styled.th`
    ${tw`text-left py-3 px-4 border-b text-sm font-semibold text-neutral-300`};
    border-color: rgba(0, 102, 255, 0.2);
`;

const Td = styled.td`
    ${tw`py-3 px-4 border-b text-sm text-neutral-300`};
    border-color: rgba(0, 102, 255, 0.1);
`;

const Badge = styled.span<{ status: 'paid' | 'pending' | 'failed' }>`
    ${tw`px-3 py-1 rounded text-xs font-semibold`};
    ${props => props.status === 'paid' && tw`bg-green-500 text-white`};
    ${props => props.status === 'pending' && tw`bg-yellow-500 text-black`};
    ${props => props.status === 'failed' && tw`bg-red-500 text-white`};
`;

const Button = styled.button`
    ${tw`px-4 py-2 rounded font-semibold transition-all duration-300`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
    
    &:hover {
        background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
    }
`;

const PaymentMethodCard = styled.div`
    ${tw`p-4 rounded-lg flex items-center justify-between`};
    background-color: rgba(0, 41, 102, 0.3);
    border: 1px solid rgba(0, 102, 255, 0.3);
`;

const SplitBillingCard = styled.div`
    ${tw`p-4 rounded-lg mb-3 flex items-center justify-between`};
    background-color: rgba(0, 52, 204, 0.2);
    border: 1px solid rgba(0, 102, 255, 0.3);
`;

export default () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'split' | 'credits'>('overview');
    const [creditData, setCreditData] = useState<CreditData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCredits()
            .then((data) => {
                setCreditData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Failed to fetch credits:', error);
                setLoading(false);
            });
    }, []);

    const userCredits = creditData?.credits || 0;
    const dollarValue = creditData?.dollar_value || 0;

    const mockInvoices = [
        { id: 'INV-001', date: '2025-10-01', amount: '$15.00', status: 'paid' as const, description: 'Monthly Hosting - Minecraft Server' },
        { id: 'INV-002', date: '2025-09-01', amount: '$15.00', status: 'paid' as const, description: 'Monthly Hosting - Minecraft Server' },
        { id: 'INV-003', date: '2025-08-01', amount: '$15.00', status: 'paid' as const, description: 'Monthly Hosting - Minecraft Server' },
        { id: 'INV-004', date: '2025-07-15', amount: '$5.00', status: 'paid' as const, description: 'Initial Setup Fee' },
    ];

    const mockSplitBilling = [
        { id: 1, serverName: 'MINECRAFT SERVER', partner: 'john@example.com', yourShare: '50%', amount: '$7.50', status: 'Active' },
        { id: 2, serverName: 'CS2 SERVER', partner: 'sarah@example.com', yourShare: '60%', amount: '$4.80', status: 'Active' },
    ];

    if (loading) {
        return (
            <PageContentBlock title={'Billing & Payments'} showFlashKey={'billing'}>
                <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <Spinner size="large" />
                </div>
            </PageContentBlock>
        );
    }

    return (
        <PageContentBlock title={'Billing & Payments'} showFlashKey={'billing'}>
            <Container>
                {/* Stats Overview */}
                <Grid>
                    <StatCard>
                        <StatValue>{userCredits}</StatValue>
                        <StatLabel>Credits (${dollarValue.toFixed(2)} value)</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>$15.00</StatValue>
                        <StatLabel>Current Balance</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>$180.00</StatValue>
                        <StatLabel>Total Spent</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>2</StatValue>
                        <StatLabel>Split Servers</StatLabel>
                    </StatCard>
                </Grid>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <Button 
                        onClick={() => setActiveTab('overview')}
                        style={{ opacity: activeTab === 'overview' ? 1 : 0.6 }}
                    >
                        Overview
                    </Button>
                    <Button 
                        onClick={() => setActiveTab('credits')}
                        style={{ opacity: activeTab === 'credits' ? 1 : 0.6 }}
                    >
                        Credits
                    </Button>
                    <Button 
                        onClick={() => setActiveTab('invoices')}
                        style={{ opacity: activeTab === 'invoices' ? 1 : 0.6 }}
                    >
                        Invoices
                    </Button>
                    <Button 
                        onClick={() => setActiveTab('split')}
                        style={{ opacity: activeTab === 'split' ? 1 : 0.6 }}
                    >
                        Split Billing
                    </Button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        <Card>
                            <CardTitle>
                                <CreditCard size={24} />
                                Payment Method
                            </CardTitle>
                            <PaymentMethodCard>
                                <div className="flex items-center gap-4">
                                    <CreditCard size={32} style={{ color: '#0066ff' }} />
                                    <div>
                                        <p className="text-white font-semibold">Visa ending in 4242</p>
                                        <p className="text-sm text-neutral-400">Expires 12/2026</p>
                                    </div>
                                </div>
                                <Button>Update</Button>
                            </PaymentMethodCard>
                        </Card>

                        <Card>
                            <CardTitle>
                                <Calendar size={24} />
                                Next Billing Date
                            </CardTitle>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-white mb-1">November 1, 2025</p>
                                    <p className="text-neutral-400">Your subscription will renew automatically</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-white">$15.00</p>
                                    <p className="text-sm text-neutral-400">Total due</p>
                                </div>
                            </div>
                        </Card>
                    </>
                )}

                {/* Invoices Tab */}
                {activeTab === 'invoices' && (
                    <Card>
                        <CardTitle>
                            <Download size={24} />
                            Invoice History
                        </CardTitle>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>Invoice #</Th>
                                    <Th>Date</Th>
                                    <Th>Description</Th>
                                    <Th>Amount</Th>
                                    <Th>Status</Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockInvoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <Td className="font-mono text-white">{invoice.id}</Td>
                                        <Td>{invoice.date}</Td>
                                        <Td>{invoice.description}</Td>
                                        <Td className="font-semibold text-white">{invoice.amount}</Td>
                                        <Td>
                                            <Badge status={invoice.status}>
                                                {invoice.status.toUpperCase()}
                                            </Badge>
                                        </Td>
                                        <Td>
                                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                                                Download PDF
                                            </button>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                )}

                {/* Credits Tab */}
                {activeTab === 'credits' && (
                    <>
                        <Card>
                            <CardTitle>
                                <DollarSign size={24} />
                                Your Credits
                            </CardTitle>
                            <div className="flex items-center justify-between mb-6 p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(0, 52, 204, 0.3) 0%, rgba(0, 102, 255, 0.2) 100%)', border: '2px solid rgba(0, 102, 255, 0.4)' }}>
                                <div>
                                    <p className="text-neutral-400 mb-2">Available Credits</p>
                                    <p className="text-6xl font-bold text-white">{userCredits}</p>
                                    <p className="text-neutral-300 mt-2">Worth ${dollarValue.toFixed(2)} (10 credits = $1.00)</p>
                                </div>
                                <Button>
                                    Apply to Invoice
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 41, 102, 0.3)', border: '1px solid rgba(0, 102, 255, 0.3)' }}>
                                    <p className="text-neutral-400 text-sm mb-2">Earn Credits</p>
                                    <p className="text-white font-bold text-lg mb-2">Refer a Friend</p>
                                    <p className="text-neutral-300 text-sm mb-3">Get 100 credits ($10) for each friend who signs up</p>
                                    <Button css="width: 100%;">
                                        Get Referral Link
                                    </Button>
                                </div>
                                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 41, 102, 0.3)', border: '1px solid rgba(0, 102, 255, 0.3)' }}>
                                    <p className="text-neutral-400 text-sm mb-2">Your Referral Code</p>
                                    <p className="text-white font-bold text-2xl mb-2">GAME2024</p>
                                    <p className="text-neutral-300 text-sm mb-3">0 friends referred so far</p>
                                    <Button css="width: 100%;">
                                        Copy Link
                                    </Button>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <CardTitle>
                                <CheckCircle size={24} />
                                Credit History
                            </CardTitle>
                            <Table>
                                <thead>
                                    <tr>
                                        <Th>Date</Th>
                                        <Th>Type</Th>
                                        <Th>Description</Th>
                                        <Th>Amount</Th>
                                        {creditData && creditData.transactions.some(t => t.admin) && <Th>Admin</Th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {creditData && creditData.transactions.length > 0 ? (
                                        creditData.transactions.map(transaction => (
                                            <tr key={transaction.id}>
                                                <Td>{new Date(transaction.created_at).toLocaleDateString()}</Td>
                                                <Td className="font-semibold text-white capitalize">{transaction.type.replace('_', ' ')}</Td>
                                                <Td className="text-neutral-400">{transaction.description || 'No description'}</Td>
                                                <Td className={transaction.amount > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} ({transaction.amount > 0 ? '+' : ''}${transaction.dollar_value.toFixed(2)})
                                                </Td>
                                                {creditData.transactions.some(t => t.admin) && (
                                                    <Td className="text-neutral-400 text-sm">
                                                        {transaction.admin ? transaction.admin.username : '-'}
                                                    </Td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <Td colSpan={4} className="text-center text-neutral-500 py-8">
                                                No credit transactions yet
                                            </Td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card>
                    </>
                )}

                {/* Split Billing Tab */}
                {activeTab === 'split' && (
                    <Card>
                        <CardTitle>
                            <Users size={24} />
                            Split Billing Servers
                        </CardTitle>
                        <p className="text-neutral-400 mb-6">
                            You're sharing these servers with others. Each person pays their share automatically.
                        </p>
                        {mockSplitBilling.map(split => (
                            <SplitBillingCard key={split.id}>
                                <div>
                                    <p className="text-white font-bold mb-1">{split.serverName}</p>
                                    <p className="text-sm text-neutral-400">
                                        Split with {split.partner} · Your share: {split.yourShare}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-white">{split.amount}</p>
                                    <p className="text-xs text-green-400">Active</p>
                                </div>
                            </SplitBillingCard>
                        ))}
                        <Button className="mt-4">
                            Invite Someone to Split
                        </Button>
                    </Card>
                )}
            </Container>
        </PageContentBlock>
    );
};

