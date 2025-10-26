import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import PromoBanner from './landing/PromoBanner';
import HeroBanner from './landing/HeroBanner';
import PricingSection from './landing/PricingSection';
import FeaturesSection from './landing/FeaturesSection';
import ReviewsSection from './landing/ReviewsSection';
import LocationsSection from './landing/LocationsSection';
import HardwareSection from './landing/HardwareSection';
import SplitBillingSection from './landing/SplitBillingSection';
import CTASection from './landing/CTASection';
import SupportSection from './landing/SupportSection';
import Footer from './landing/Footer';

const Container = styled.div`
    ${tw`min-h-screen flex flex-col`};
`;

const LandingPage = () => {
    return (
        <Container>
            <PromoBanner />
            <HeroBanner />
            <PricingSection />
            <ReviewsSection />
            <FeaturesSection />
            <HardwareSection />
            <LocationsSection />
            <SplitBillingSection />
            <CTASection />
            <SupportSection />
            <Footer />
        </Container>
    );
};

export default LandingPage;


