import React from 'react';
import { Link } from 'react-router-dom';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const Container = styled.div`
    ${tw`min-h-screen flex flex-col`};
`;

const Hero = styled.div`
    ${tw`flex-1 flex items-center justify-center px-4 py-20`};
`;

const Content = styled.div`
    ${tw`max-w-6xl mx-auto text-center`};
`;

const Title = styled.h1`
    ${tw`text-6xl font-bold mb-6 text-white`};
    text-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
`;

const Subtitle = styled.p`
    ${tw`text-2xl mb-12 text-neutral-200`};
`;

const ButtonGroup = styled.div`
    ${tw`flex gap-6 justify-center flex-wrap mb-20`};
`;

const PrimaryButton = styled(Link)`
    ${tw`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
    
    &:hover {
        background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 102, 255, 0.4);
    }
`;

const SecondaryButton = styled(Link)`
    ${tw`px-8 py-4 rounded-lg text-lg font-semibold border-2 transition-all duration-300`};
    background-color: rgba(15, 23, 42, 0.7);
    color: white;
    border-color: rgba(0, 102, 255, 0.5);
    backdrop-filter: blur(10px);
    
    &:hover {
        background-color: rgba(0, 52, 204, 0.3);
        border-color: #0066ff;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
    }
`;

const Features = styled.div`
    ${tw`grid md:grid-cols-3 gap-8 mb-20`};
`;

const FeatureCard = styled.div`
    ${tw`p-8 rounded-lg transition-all duration-300`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.2);
    
    &:hover {
        background-color: rgba(0, 52, 204, 0.2);
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 102, 255, 0.3);
        border-color: rgba(0, 102, 255, 0.5);
    }
`;

const FeatureIcon = styled.div`
    ${tw`text-5xl mb-4`};
`;

const FeatureTitle = styled.h3`
    ${tw`text-xl font-bold mb-2 text-white`};
`;

const FeatureDescription = styled.p`
    ${tw`text-neutral-300`};
`;

const LandingPage = () => {
    return (
        <Container>
            <Hero>
                <Content>
                    <Title>Welcome to GameControl</Title>
                    <Subtitle>
                        Premium Game Server Hosting Made Simple
                    </Subtitle>
                    
                    <ButtonGroup>
                        <PrimaryButton to="/auth/login">
                            Get Started
                        </PrimaryButton>
                        <SecondaryButton to="/servers">
                            View Dashboard
                        </SecondaryButton>
                    </ButtonGroup>
                    
                    <Features>
                        <FeatureCard>
                            <FeatureIcon>🎮</FeatureIcon>
                            <FeatureTitle>Multiple Games</FeatureTitle>
                            <FeatureDescription>
                                Host Minecraft, CS:GO, Rust, ARK, and more with one-click installation
                            </FeatureDescription>
                        </FeatureCard>
                        
                        <FeatureCard>
                            <FeatureIcon>⚡</FeatureIcon>
                            <FeatureTitle>Instant Setup</FeatureTitle>
                            <FeatureDescription>
                                Deploy your game server in minutes with our automated system
                            </FeatureDescription>
                        </FeatureCard>
                        
                        <FeatureCard>
                            <FeatureIcon>🔒</FeatureIcon>
                            <FeatureTitle>Secure & Reliable</FeatureTitle>
                            <FeatureDescription>
                                DDoS protection, automated backups, and 99.9% uptime guarantee
                            </FeatureDescription>
                        </FeatureCard>
                        
                        <FeatureCard>
                            <FeatureIcon>💰</FeatureIcon>
                            <FeatureTitle>Flexible Pricing</FeatureTitle>
                            <FeatureDescription>
                                Pay only for what you use with our scalable hosting plans
                            </FeatureDescription>
                        </FeatureCard>
                        
                        <FeatureCard>
                            <FeatureIcon>👥</FeatureIcon>
                            <FeatureTitle>Split Billing</FeatureTitle>
                            <FeatureDescription>
                                Share server costs with friends and split payments automatically
                            </FeatureDescription>
                        </FeatureCard>
                        
                        <FeatureCard>
                            <FeatureIcon>📊</FeatureIcon>
                            <FeatureTitle>Full Control</FeatureTitle>
                            <FeatureDescription>
                                Powerful control panel with real-time stats and file management
                            </FeatureDescription>
                        </FeatureCard>
                    </Features>
                </Content>
            </Hero>
        </Container>
    );
};

export default LandingPage;


