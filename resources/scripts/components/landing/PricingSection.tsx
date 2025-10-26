import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { Box, Crosshair, Hammer } from 'lucide-react';

const Section = styled.section`
    ${tw`py-20 px-4`};
    background-color: #000a1a;
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto`};
`;

const SectionTitle = styled.h2`
    ${tw`text-4xl font-bold text-center mb-4 text-white`};
    text-shadow: 0 2px 10px rgba(0, 102, 255, 0.3);
`;

const SectionSubtitle = styled.p`
    ${tw`text-xl text-center mb-12 text-neutral-200`};
`;

const PricingGrid = styled.div`
    ${tw`grid md:grid-cols-3 gap-8`};
`;

const PricingCard = styled.div<{ featured?: boolean }>`
    ${tw`p-8 rounded-xl transition-all duration-300 relative`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 2px solid ${props => props.featured ? '#0066ff' : 'rgba(0, 102, 255, 0.2)'};
    transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
    
    &:hover {
        background-color: rgba(0, 52, 204, 0.3);
        transform: scale(1.08);
        box-shadow: 0 12px 32px rgba(0, 102, 255, 0.4);
        border-color: #0066ff;
    }
`;

const FeaturedBadge = styled.div`
    ${tw`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
`;

const GameIcon = styled.div`
    ${tw`text-6xl mb-4 text-center`};
    color: #0066ff;
`;

const GameTitle = styled.h3`
    ${tw`text-2xl font-bold mb-2 text-white text-center`};
`;

const Price = styled.div`
    ${tw`text-center mb-6`};
`;

const PriceAmount = styled.span`
    ${tw`text-5xl font-bold text-white`};
`;

const PriceUnit = styled.span`
    ${tw`text-xl text-neutral-300`};
`;

const FeatureList = styled.ul`
    ${tw`mb-8 space-y-3`};
`;

const Feature = styled.li`
    ${tw`flex items-start text-neutral-200`};
    
    &::before {
        content: '✓';
        ${tw`mr-3 text-green-400 font-bold`};
    }
`;

const OrderButton = styled(Link)`
    ${tw`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
    
    &:hover {
        background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
    }
`;

const PricingSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <SectionTitle>Game Server Pricing</SectionTitle>
                <SectionSubtitle>Choose the perfect plan for your gaming community</SectionSubtitle>
                
                <PricingGrid>
                    {/* Minecraft */}
                    <PricingCard>
                        <GameIcon><Box size={64} /></GameIcon>
                        <GameTitle>Minecraft</GameTitle>
                        <Price>
                            <PriceAmount>$5</PriceAmount>
                            <PriceUnit>/month</PriceUnit>
                        </Price>
                        <FeatureList>
                            <Feature>2GB RAM</Feature>
                            <Feature>10GB SSD Storage</Feature>
                            <Feature>Unlimited Player Slots</Feature>
                            <Feature>Paper, Spigot, Forge Support</Feature>
                            <Feature>Instant Setup</Feature>
                            <Feature>DDoS Protection</Feature>
                            <Feature>Automatic Backups</Feature>
                        </FeatureList>
                        <OrderButton to="/auth/login">
                            Order Now
                        </OrderButton>
                    </PricingCard>

                    {/* Counter-Strike 2 - Featured */}
                    <PricingCard featured>
                        <FeaturedBadge>MOST POPULAR</FeaturedBadge>
                        <GameIcon><Crosshair size={64} /></GameIcon>
                        <GameTitle>Counter-Strike 2</GameTitle>
                        <Price>
                            <PriceAmount>$8</PriceAmount>
                            <PriceUnit>/month</PriceUnit>
                        </Price>
                        <FeatureList>
                            <Feature>4GB RAM</Feature>
                            <Feature>20GB SSD Storage</Feature>
                            <Feature>128 Tick Available</Feature>
                            <Feature>Custom Maps & Plugins</Feature>
                            <Feature>Auto-Updates</Feature>
                            <Feature>Anti-Cheat Ready</Feature>
                            <Feature>24/7 Support</Feature>
                        </FeatureList>
                        <OrderButton to="/auth/login">
                            Order Now
                        </OrderButton>
                    </PricingCard>

                    {/* Rust */}
                    <PricingCard>
                        <GameIcon><Hammer size={64} /></GameIcon>
                        <GameTitle>Rust</GameTitle>
                        <Price>
                            <PriceAmount>$12</PriceAmount>
                            <PriceUnit>/month</PriceUnit>
                        </Price>
                        <FeatureList>
                            <Feature>6GB RAM</Feature>
                            <Feature>30GB SSD Storage</Feature>
                            <Feature>Up to 100 Players</Feature>
                            <Feature>Oxide/uMod Support</Feature>
                            <Feature>Custom Map Sizes</Feature>
                            <Feature>Wipe Management</Feature>
                            <Feature>Priority Support</Feature>
                        </FeatureList>
                        <OrderButton to="/auth/login">
                            Order Now
                        </OrderButton>
                    </PricingCard>
                </PricingGrid>
            </Container>
        </Section>
    );
};

export default PricingSection;

