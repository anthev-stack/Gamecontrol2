import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';

const Section = styled.section`
    ${tw`py-16 px-4`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-8`};
`;

const Content = styled.div`
    ${tw`flex-1`};
`;

const Title = styled.h2`
    ${tw`text-4xl font-bold mb-4 text-white`};
`;

const Subtitle = styled.p`
    ${tw`text-xl text-white mb-6`};
`;

const ContactInfo = styled.div`
    ${tw`flex gap-8 flex-wrap`};
`;

const ContactItem = styled.a`
    ${tw`flex items-center gap-3 text-white hover:text-neutral-100 transition-colors duration-200`};
    
    svg {
        ${tw`text-xl`};
    }
`;

const OrderButton = styled(Link)`
    ${tw`px-10 py-4 rounded-lg text-xl font-bold transition-all duration-300`};
    background-color: #000a1a;
    color: white;
    border: 2px solid white;
    
    &:hover {
        background-color: white;
        color: #0052cc;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
`;

const CTASection: React.FC = () => {
    return (
        <Section>
            <Container>
                <Content>
                    <Title>Deploy your game server!</Title>
                    <Subtitle>Not sure if this is right for you? Contact Us!</Subtitle>
                    <ContactInfo>
                        <ContactItem href="mailto:support@gamecontrol.com">
                            <Mail size={24} />
                            <span>Contact Us</span>
                        </ContactItem>
                        <ContactItem href="https://discord.gg/your-server" target="_blank">
                            <MessageCircle size={24} />
                            <span>Sales Live Chat</span>
                        </ContactItem>
                    </ContactInfo>
                </Content>
                <OrderButton to="/cart">
                    CREATE YOUR SERVER →
                </OrderButton>
            </Container>
        </Section>
    );
};

export default CTASection;

