import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded no-underline text-neutral-200 items-center p-4 border border-transparent transition-colors duration-150 overflow-hidden`};
    background: none;
    
    ${(props) => props.$hoverable !== false && tw`hover:border-neutral-500`};

    & .icon {
        ${tw`w-16 flex items-center justify-center p-3`};
        background: none;
        border: none;
        border-radius: 0;
    }
`;
