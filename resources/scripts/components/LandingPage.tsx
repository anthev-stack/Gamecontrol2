import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import HeroBanner from './landing/HeroBanner';
import PricingSection from './landing/PricingSection';
import FeaturesSection from './landing/FeaturesSection';
import LocationsSection from './landing/LocationsSection';
import SplitBillingSection from './landing/SplitBillingSection';
import HardwareSection from './landing/HardwareSection';
import SupportSection from './landing/SupportSection';
import Footer from './landing/Footer';

const Container = styled.div`
    ${tw`min-h-screen flex flex-col`};
`;

const LandingPage = () => {
    return (
        <Container>
            <HeroBanner />
            <PricingSection />
            <FeaturesSection />
            <LocationsSection />
            <SplitBillingSection />
            <HardwareSection />
            <SupportSection />
            <Footer />
        </Container>
    );
};

export default LandingPage;


