import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Section = styled.section`
    ${tw`py-20 px-4`};
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto`};
`;

const Grid = styled.div`
    ${tw`grid md:grid-cols-2 gap-12 items-center`};
`;

const Content = styled.div`
    ${tw``};
`;

const SectionTitle = styled.h2`
    ${tw`text-4xl font-bold mb-6 text-white`};
    text-shadow: 0 2px 10px rgba(0, 102, 255, 0.3);
`;

const Description = styled.p`
    ${tw`text-lg mb-8 text-neutral-200 leading-relaxed`};
`;

const FeatureList = styled.ul`
    ${tw`space-y-4 mb-8`};
`;

const Feature = styled.li`
    ${tw`flex items-start text-neutral-200`};
    
    &::before {
        content: '✓';
        ${tw`mr-3 text-2xl`};
        color: #00ff88;
    }
`;

const DiscordButton = styled.a`
    ${tw`inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-300`};
    background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
    color: white;
    
    &:hover {
        background: linear-gradient(135deg, #4752C4 0%, #5865F2 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(88, 101, 242, 0.4);
    }
`;

const StatsGrid = styled.div`
    ${tw`grid grid-cols-2 gap-6`};
`;

const StatCard = styled.div`
    ${tw`p-6 rounded-xl text-center`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.2);
`;

const StatValue = styled.div`
    ${tw`text-4xl font-bold mb-2`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const StatLabel = styled.div`
    ${tw`text-sm text-neutral-300`};
`;

const SupportSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <Grid>
                    <Content>
                        <SectionTitle>24/7 Support & Community</SectionTitle>
                        <Description>
                            Our dedicated support team and active community are here to help you succeed. 
                            Get instant help through our Discord server or submit a ticket for personalized assistance.
                        </Description>
                        
                        <FeatureList>
                            <Feature>24/7 Live Support via Discord</Feature>
                            <Feature>Average 5-minute response time</Feature>
                            <Feature>Knowledge base & tutorials</Feature>
                            <Feature>Active community of gamers</Feature>
                            <Feature>Priority support for premium plans</Feature>
                        </FeatureList>
                        
                        <DiscordButton href="https://discord.gg/your-server" target="_blank" rel="noopener noreferrer">
                            <span className="text-2xl mr-3">💬</span>
                            Join Our Discord
                        </DiscordButton>
                    </Content>
                    
                    <StatsGrid>
                        <StatCard>
                            <StatValue>99.9%</StatValue>
                            <StatLabel>Uptime Guarantee</StatLabel>
                        </StatCard>

                        <StatCard>
                            <StatValue>&lt;5min</StatValue>
                            <StatLabel>Response Time</StatLabel>
                        </StatCard>

                        <StatCard>
                            <StatValue>1,000+</StatValue>
                            <StatLabel>Active Servers</StatLabel>
                        </StatCard>

                        <StatCard>
                            <StatValue>5,000+</StatValue>
                            <StatLabel>Happy Gamers</StatLabel>
                        </StatCard>
                    </StatsGrid>
                </Grid>
            </Container>
        </Section>
    );
};

export default SupportSection;

