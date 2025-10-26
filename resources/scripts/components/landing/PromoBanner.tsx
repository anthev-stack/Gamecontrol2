import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

const Banner = styled.div`
    ${tw`w-full py-2 px-4 text-center text-sm font-medium`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
`;

const PromoText = styled.span`
    ${tw`mr-2`};
`;

const PromoCode = styled.span`
    ${tw`font-bold px-2 py-1 rounded`};
    background-color: rgba(255, 255, 255, 0.2);
`;

const PromoBanner: React.FC = () => {
    return (
        <Banner>
            <FontAwesomeIcon icon={faBolt} className="mr-2" />
            <PromoText>Get 25% off your first month with promo code</PromoText>
            <PromoCode>GAMECONTROL25</PromoCode>
        </Banner>
    );
};

export default PromoBanner;

