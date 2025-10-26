import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

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
    ${tw`text-xl text-center mb-16 text-neutral-200`};
`;

const Grid = styled.div`
    ${tw`grid md:grid-cols-2 lg:grid-cols-3 gap-8`};
`;

const FeatureCard = styled.div`
    ${tw`p-8 rounded-xl transition-all duration-300`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.2);
    
    &:hover {
        background-color: rgba(0, 52, 204, 0.3);
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 102, 255, 0.3);
        border-color: rgba(0, 102, 255, 0.5);
    }
`;

const Icon = styled.div`
    ${tw`text-5xl mb-4`};
`;

const Title = styled.h3`
    ${tw`text-xl font-bold mb-3 text-white`};
`;

const Description = styled.p`
    ${tw`text-neutral-300 leading-relaxed`};
`;

const FeaturesSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <SectionTitle>Powerful Control Panel</SectionTitle>
                <SectionSubtitle>Everything you need to manage your game servers</SectionSubtitle>
                
                <Grid>
                    <FeatureCard>
                        <Icon>🖥️</Icon>
                        <Title>Web-Based Console</Title>
                        <Description>
                            Access your server console from anywhere with real-time command execution and log viewing.
                        </Description>
                    </FeatureCard>

                    <FeatureCard>
                        <Icon>📁</Icon>
                        <Title>File Manager</Title>
                        <Description>
                            Upload, download, edit, and manage your server files directly through the browser.
                        </Description>
                    </FeatureCard>

                    <FeatureCard>
                        <Icon>📊</Icon>
                        <Title>Resource Monitoring</Title>
                        <Description>
                            Real-time CPU, RAM, and disk usage graphs to keep track of your server's performance.
                        </Description>
                    </FeatureCard>

                    <FeatureCard>
                        <Icon>⏰</Icon>
                        <Title>Task Scheduler</Title>
                        <Description>
                            Automate server restarts, backups, and commands with cron-based scheduling.
                        </Description>
                    </FeatureCard>

                    <FeatureCard>
                        <Icon>👥</Icon>
                        <Title>User Management</Title>
                        <Description>
                            Grant specific permissions to team members without sharing full admin access.
                        </Description>
                    </FeatureCard>

                    <FeatureCard>
                        <Icon>🔐</Icon>
                        <Title>Secure SFTP Access</Title>
                        <Description>
                            Transfer files securely using SFTP with per-user authentication and permissions.
                        </Description>
                    </FeatureCard>
                </Grid>
            </Container>
        </Section>
    );
};

export default FeaturesSection;

