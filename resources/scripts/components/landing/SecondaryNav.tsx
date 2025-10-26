import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const NavContainer = styled.nav`
    ${tw`w-full py-4 px-4 border-b`};
    background-color: #001433;
    border-bottom: 1px solid rgba(0, 102, 255, 0.2);
`;

const NavContent = styled.div`
    ${tw`max-w-7xl mx-auto flex items-center justify-center gap-12 flex-wrap`};
`;

const NavItem = styled(Link)`
    ${tw`flex flex-col items-center text-center cursor-pointer transition-all duration-200 px-4 py-2`};
    
    &:hover {
        transform: translateY(-2px);
        
        .nav-line-1, .nav-line-2 {
            color: #0066ff;
        }
    }
`;

const ExternalNavItem = styled.a`
    ${tw`flex flex-col items-center text-center cursor-pointer transition-all duration-200 px-4 py-2`};
    
    &:hover {
        transform: translateY(-2px);
        
        .nav-line-1, .nav-line-2 {
            color: #0066ff;
        }
    }
`;

const NavLine1 = styled.span`
    ${tw`text-sm font-bold tracking-wider text-white transition-colors duration-200`};
`;

const NavLine2 = styled.span`
    ${tw`text-xs font-semibold tracking-widest text-neutral-300 transition-colors duration-200`};
`;

const SecondaryNav: React.FC = () => {
    return (
        <NavContainer>
            <NavContent>
                <NavItem to="/auth/login">
                    <NavLine1 className="nav-line-1">GAME</NavLine1>
                    <NavLine2 className="nav-line-2">SERVERS</NavLine2>
                </NavItem>

                <NavItem to="/">
                    <NavLine1 className="nav-line-1">ABOUT</NavLine1>
                    <NavLine2 className="nav-line-2">US</NavLine2>
                </NavItem>

                <NavItem to="/">
                    <NavLine1 className="nav-line-1">KNOWLEDGE</NavLine1>
                    <NavLine2 className="nav-line-2">BASE</NavLine2>
                </NavItem>

                <ExternalNavItem href="https://discord.gg/your-server" target="_blank">
                    <NavLine1 className="nav-line-1">JOIN US</NavLine1>
                    <NavLine2 className="nav-line-2">ON DISCORD</NavLine2>
                </ExternalNavItem>
            </NavContent>
        </NavContainer>
    );
};

export default SecondaryNav;

