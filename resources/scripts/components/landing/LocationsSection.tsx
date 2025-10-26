import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Section = styled.section`
    ${tw`py-20 px-4 relative`};
    background: linear-gradient(135deg, rgba(0, 10, 26, 0.8) 0%, rgba(0, 41, 102, 0.6) 100%);
    
    &::before {
        content: '';
        ${tw`absolute inset-0 opacity-10`};
        background-image: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h60v60H0z" fill="none"/><path d="M30 0L0 30l30 30 30-30L30 0z" fill="%230066ff" opacity="0.1"/></svg>');
        background-size: 60px 60px;
    }
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto relative z-10`};
`;

const SectionTitle = styled.h2`
    ${tw`text-4xl font-bold text-center mb-4 text-white`};
    text-shadow: 0 2px 10px rgba(0, 102, 255, 0.3);
`;

const SectionSubtitle = styled.p`
    ${tw`text-xl text-center mb-16 text-neutral-200`};
`;

const LocationsGrid = styled.div`
    ${tw`grid md:grid-cols-3 gap-8`};
`;

const LocationCard = styled.div`
    ${tw`p-6 rounded-xl text-center transition-all duration-300`};
    background-color: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.3);
    
    &:hover {
        background-color: rgba(0, 52, 204, 0.4);
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 102, 255, 0.4);
    }
`;

const FlagIcon = styled.div`
    ${tw`text-6xl mb-3`};
`;

const LocationName = styled.h4`
    ${tw`text-xl font-bold mb-2 text-white`};
`;

const LocationDetails = styled.p`
    ${tw`text-neutral-300 mb-2`};
`;

const Ping = styled.div`
    ${tw`text-green-400 font-semibold`};
`;

const LocationsSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <SectionTitle>Global Network</SectionTitle>
                <SectionSubtitle>Low-latency servers in strategic locations worldwide</SectionSubtitle>
                
                <LocationsGrid>
                    <LocationCard>
                        <FlagIcon>🇺🇸</FlagIcon>
                        <LocationName>United States</LocationName>
                        <LocationDetails>New York, NY</LocationDetails>
                        <Ping>~15ms average ping</Ping>
                    </LocationCard>

                    <LocationCard>
                        <FlagIcon>🇪🇺</FlagIcon>
                        <LocationName>Europe</LocationName>
                        <LocationDetails>Frankfurt, Germany</LocationDetails>
                        <Ping>~20ms average ping</Ping>
                    </LocationCard>

                    <LocationCard>
                        <FlagIcon>🇸🇬</FlagIcon>
                        <LocationName>Asia Pacific</LocationName>
                        <LocationDetails>Singapore</LocationDetails>
                        <Ping>~25ms average ping</Ping>
                    </LocationCard>
                </LocationsGrid>
            </Container>
        </Section>
    );
};

export default LocationsSection;

