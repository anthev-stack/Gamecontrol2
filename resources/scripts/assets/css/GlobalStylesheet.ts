import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        ${tw`font-sans text-neutral-200`};
        letter-spacing: 0.015em;
        background-color: #000a1a;
        min-height: 100vh;
    }
    
    /* Apply network pattern background to servers page */
    body:has([data-page="servers"]) {
        position: relative;
        
        &::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h60v60H0z" fill="none"/><path d="M30 0L0 30l30 30 30-30L30 0z" fill="%230066ff" opacity="0.1"/></svg>');
            background-size: 60px 60px;
            pointer-events: none;
            z-index: 0;
        }
    }
    
    /* Remove bg-neutral backgrounds completely */
    .bg-neutral-600,
    .bg-neutral-700,
    .bg-neutral-800,
    .bg-neutral-900 {
        background: none !important;
        background-color: transparent !important;
    }
    
    /* Add transparency to content blocks */
    [class*="ContentBox"], 
    [class*="TitledGreyBox"] {
        background-color: rgba(15, 23, 42, 0.75) !important;
        backdrop-filter: blur(10px);
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px hsl(211, 10%, 53%), inset 0 0 0 4px hsl(209deg 18% 30%);
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
