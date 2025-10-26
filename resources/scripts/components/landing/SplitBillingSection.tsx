import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUserFriends, faCreditCard, faGamepad } from '@fortawesome/free-solid-svg-icons';

const Section = styled.section`
    ${tw`py-20 px-4`};
    background-color: #000a1a;
`;

const Container = styled.div`
    ${tw`max-w-6xl mx-auto`};
`;

const Content = styled.div`
    ${tw`rounded-2xl p-12 text-center`};
    background: linear-gradient(135deg, rgba(0, 52, 204, 0.3) 0%, rgba(0, 102, 255, 0.2) 100%);
    backdrop-filter: blur(15px);
    border: 2px solid rgba(0, 102, 255, 0.4);
`;

const Icon = styled.div`
    ${tw`text-7xl mb-6`};
    color: #0066ff;
`;

const Title = styled.h2`
    ${tw`text-4xl font-bold mb-4 text-white`};
    text-shadow: 0 2px 10px rgba(0, 102, 255, 0.3);
`;

const Description = styled.p`
    ${tw`text-xl mb-8 text-neutral-200 max-w-3xl mx-auto`};
`;

const FeatureGrid = styled.div`
    ${tw`grid md:grid-cols-3 gap-6 mt-12`};
`;

const Feature = styled.div`
    ${tw`p-6 rounded-lg`};
    background-color: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(0, 102, 255, 0.2);
`;

const FeatureTitle = styled.h4`
    ${tw`text-lg font-bold mb-2 text-white`};
`;

const FeatureDescription = styled.p`
    ${tw`text-neutral-300 text-sm`};
`;

const SplitBillingSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <Content>
                    <Icon><FontAwesomeIcon icon={faDollarSign} /></Icon>
                    <Title>Split Cost Billing</Title>
                    <Description>
                        Play with friends and split the server cost! Invite your teammates, divide the bill fairly, 
                        and everyone gets full access to manage the server.
                    </Description>
                    
                    <FeatureGrid>
                        <Feature>
                            <FeatureTitle><FontAwesomeIcon icon={faUserFriends} className="mr-2" /> Easy Sharing</FeatureTitle>
                            <FeatureDescription>
                                Invite friends by email and set custom split percentages (50/50, 60/40, etc.)
                            </FeatureDescription>
                        </Feature>

                        <Feature>
                            <FeatureTitle><FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Auto-Billing</FeatureTitle>
                            <FeatureDescription>
                                Each person gets charged their share automatically every month
                            </FeatureDescription>
                        </Feature>

                        <Feature>
                            <FeatureTitle><FontAwesomeIcon icon={faGamepad} className="mr-2" /> Full Access</FeatureTitle>
                            <FeatureDescription>
                                All contributors get complete server management permissions
                            </FeatureDescription>
                        </Feature>
                    </FeatureGrid>
                </Content>
            </Container>
        </Section>
    );
};

export default SplitBillingSection;

