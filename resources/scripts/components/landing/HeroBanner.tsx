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
    ${tw`relative z-10 text-left px-4 max-w-7xl mx-auto flex items-center h-full`};
`;

const TextContent = styled.div`
    ${tw`max-w-xl`};
`;

const SlideLabel = styled.div`
    ${tw`text-lg mb-2 text-neutral-300`};
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const SlideTitle = styled.h1`
    ${tw`text-6xl md:text-7xl font-bold mb-4 text-white`};
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const SlideDescription = styled.p`
    ${tw`text-2xl font-semibold mb-2 text-white`};
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const SlideDetail = styled.p`
    ${tw`text-lg mb-8 text-neutral-200`};
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    
    span {
        ${tw`font-bold`};
        color: #0066ff;
    }
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
        title: 'Now Available',
        subtitle: 'MINECRAFT',
        description: 'On Sale Now: Get 25% Off!',
        detail: 'Use promo code GAMECONTROL25 to get 25% off your first month!',
        cta: 'CREATE YOUR SERVER →',
        // Placeholder - will be replaced with actual Minecraft image
        background: 'linear-gradient(135deg, rgba(0, 10, 26, 0.85) 0%, rgba(0, 41, 102, 0.7) 100%), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzRhN2MxNyIvPjwvc3ZnPg==)',
    },
    {
        id: 2,
        title: 'Now Available',
        subtitle: 'COUNTER-STRIKE 2',
        description: 'Professional CS2 Hosting',
        detail: 'High-performance servers with 128-tick support and instant deployment!',
        cta: 'CREATE YOUR SERVER →',
        background: 'linear-gradient(135deg, rgba(0, 10, 26, 0.85) 0%, rgba(0, 41, 102, 0.7) 100%), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzBmMzQ2MCIvPjwvc3ZnPg==)',
    },
    {
        id: 3,
        title: 'Now Available',
        subtitle: 'RUST',
        description: 'Ultimate Rust Experience',
        detail: 'Powerful dedicated resources with full mod support and weekly wipes!',
        cta: 'CREATE YOUR SERVER →',
        background: 'linear-gradient(135deg, rgba(0, 10, 26, 0.85) 0%, rgba(0, 41, 102, 0.7) 100%), url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzZiMzYxOSIvPjwvc3ZnPg==)',
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
                    style={{ background: slide.background, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                    <SlideContent>
                        <TextContent>
                            <SlideLabel>{slide.title}</SlideLabel>
                            <SlideTitle>{slide.subtitle}</SlideTitle>
                            <SlideDescription>{slide.description}</SlideDescription>
                            <SlideDetail dangerouslySetInnerHTML={{ 
                                __html: slide.detail.replace(/GAMECONTROL25/g, '<span>GAMECONTROL25</span>').replace(/25%/g, '<span>25%</span>')
                            }} />
                            <CTAButton to="/cart">
                                {slide.cta}
                            </CTAButton>
                        </TextContent>
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

