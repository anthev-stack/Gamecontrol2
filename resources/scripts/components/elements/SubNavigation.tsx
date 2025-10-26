import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow overflow-x-auto`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-3 px-4 no-underline whitespace-nowrap transition-all duration-150`};
            color: rgba(255, 255, 255, 0.9);

            &:not(:first-of-type) {
                ${tw`ml-2`};
            }

            &:hover {
                color: white;
            }

            &:active,
            &.active {
                color: white;
                box-shadow: inset 0 -2px rgba(255, 255, 255, 0.8);
            }
        }
    }
`;

export default SubNavigation;
