import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faHdd, faNetworkWired, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Section = styled.section`
    ${tw`py-20 px-4`};
    background-color: #001433;
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

const SpecsGrid = styled.div`
    ${tw`grid md:grid-cols-2 lg:grid-cols-4 gap-6`};
`;

const SpecCard = styled.div`
    ${tw`p-6 rounded-xl text-center transition-all duration-300`};
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
    ${tw`text-5xl mb-3`};
    color: #0066ff;
`;

const SpecTitle = styled.h4`
    ${tw`text-lg font-bold mb-2 text-white`};
`;

const SpecValue = styled.p`
    ${tw`text-2xl font-bold mb-2`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const SpecDescription = styled.p`
    ${tw`text-sm text-neutral-300`};
`;

const HardwareSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <SectionTitle>Enterprise Hardware</SectionTitle>
                <SectionSubtitle>Powered by industry-leading server infrastructure</SectionSubtitle>
                
                <SpecsGrid>
                    <SpecCard>
                        <Icon><FontAwesomeIcon icon={faMicrochip} /></Icon>
                        <SpecTitle>CPU</SpecTitle>
                        <SpecValue>AMD Ryzen 9</SpecValue>
                        <SpecDescription>
                            Latest generation processors for maximum performance
                        </SpecDescription>
                    </SpecCard>

                    <SpecCard>
                        <Icon><FontAwesomeIcon icon={faHdd} /></Icon>
                        <SpecTitle>Storage</SpecTitle>
                        <SpecValue>NVMe SSD</SpecValue>
                        <SpecDescription>
                            Ultra-fast NVMe drives for instant world loading
                        </SpecDescription>
                    </SpecCard>

                    <SpecCard>
                        <Icon><FontAwesomeIcon icon={faNetworkWired} /></Icon>
                        <SpecTitle>Network</SpecTitle>
                        <SpecValue>10 Gbps</SpecValue>
                        <SpecDescription>
                            Lightning-fast network with unlimited bandwidth
                        </SpecDescription>
                    </SpecCard>

                    <SpecCard>
                        <Icon><FontAwesomeIcon icon={faShieldAlt} /></Icon>
                        <SpecTitle>Protection</SpecTitle>
                        <SpecValue>DDoS Shield</SpecValue>
                        <SpecDescription>
                            Advanced DDoS mitigation keeps you online 24/7
                        </SpecDescription>
                    </SpecCard>
                </SpecsGrid>
            </Container>
        </Section>
    );
};

export default HardwareSection;

