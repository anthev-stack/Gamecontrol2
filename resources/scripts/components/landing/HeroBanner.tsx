import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { Link } from 'react-router-dom';

const BannerContainer = styled.div`
    ${tw`relative w-full h-96 overflow-hidden`};
`;

const Slide = styled.div<{ active: boolean }>`
    ${tw`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center`};
    opacity: ${props => props.active ? 1 : 0};
    background-size: cover;
    background-position: center;
    
    &::before {
        content: '';
        ${tw`absolute inset-0`};
        background: linear-gradient(135deg, rgba(0, 20, 51, 0.85) 0%, rgba(0, 52, 204, 0.7) 100%);
    }
`;

const SlideContent = styled.div`
    ${tw`relative z-10 text-center px-4 max-w-4xl`};
`;

const SlideTitle = styled.h1`
    ${tw`text-5xl md:text-6xl font-bold mb-4 text-white`};
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const SlideSubtitle = styled.p`
    ${tw`text-xl md:text-2xl mb-8 text-neutral-100`};
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const CTAButton = styled(Link)`
    ${tw`inline-block px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
    
    &:hover {
        background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 102, 255, 0.4);
    }
`;

const Indicators = styled.div`
    ${tw`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20`};
`;

const Indicator = styled.button<{ active: boolean }>`
    ${tw`w-3 h-3 rounded-full transition-all duration-300`};
    background-color: ${props => props.active ? '#0066ff' : 'rgba(255, 255, 255, 0.4)'};
    
    &:hover {
        background-color: ${props => props.active ? '#0052cc' : 'rgba(255, 255, 255, 0.6)'};
    }
`;

const slides = [
    {
        id: 1,
        title: 'Host Minecraft Servers',
        subtitle: 'Instant setup for Vanilla, Paper, Spigot, Forge, and Modpacks',
        cta: 'Start Your Server',
        // Placeholder - will be replaced with actual image
        background: 'linear-gradient(135deg, #1e3a20 0%, #2d5016 50%, #4a7c17 100%)',
    },
    {
        id: 2,
        title: 'Counter-Strike 2 Hosting',
        subtitle: 'High-performance servers with DDoS protection and auto-updates',
        cta: 'Deploy CS2 Server',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
        id: 3,
        title: 'Rust Server Hosting',
        subtitle: 'Powerful dedicated resources for the ultimate Rust experience',
        cta: 'Launch Rust Server',
        background: 'linear-gradient(135deg, #2d1810 0%, #4a2617 50%, #6b3619 100%)',
    },
];

const HeroBanner: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <BannerContainer>
            {slides.map((slide, index) => (
                <Slide 
                    key={slide.id} 
                    active={index === activeSlide}
                    style={{ background: slide.background }}
                >
                    <SlideContent>
                        <SlideTitle>{slide.title}</SlideTitle>
                        <SlideSubtitle>{slide.subtitle}</SlideSubtitle>
                        <CTAButton to="/auth/login">
                            {slide.cta}
                        </CTAButton>
                    </SlideContent>
                </Slide>
            ))}
            
            <Indicators>
                {slides.map((_, index) => (
                    <Indicator
                        key={index}
                        active={index === activeSlide}
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </Indicators>
        </BannerContainer>
    );
};

export default HeroBanner;

