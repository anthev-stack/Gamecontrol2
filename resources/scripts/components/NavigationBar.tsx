import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Layers, Settings, LogOut, Menu, X, CreditCard, User } from 'lucide-react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div<{ $isOpen?: boolean }>`
    ${tw`flex h-full items-center justify-center`};
    
    @media (max-width: 768px) {
        ${tw`fixed top-14 left-0 right-0 flex-col items-stretch shadow-lg transition-all duration-300`};
        ${props => props.$isOpen ? tw`max-h-screen` : tw`max-h-0 overflow-hidden`};
        background-color: #000a1a;
        z-index: 50;
    }
    
    & > a,
    & > button,
    & > .navigation-link,
    & > div {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-6 cursor-pointer transition-all duration-150`};

        @media (max-width: 768px) {
            ${tw`h-auto py-4 border-b`};
            border-color: rgba(0, 102, 255, 0.2);
            justify-content: flex-start;
        }

        &:active,
        &:hover {
            ${tw`text-neutral-100`};
            background-color: rgba(0, 52, 204, 0.3);
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px ${theme`colors.cyan.600`.toString()};
        }
    }
    
    /* Mobile label styling */
    span.mobile-label {
        display: none;
        
        @media (max-width: 768px) {
            display: inline-block !important;
            margin-left: 12px;
            color: white;
            font-size: 16px;
        }
    }
`;

const MobileMenuButton = styled.button`
    ${tw`md:hidden flex items-center text-neutral-300 px-4 cursor-pointer`};
    
    &:hover {
        ${tw`text-neutral-100`};
    }
`;

const LoginButton = styled(Link)`
    ${tw`px-6 py-2 rounded-lg font-semibold transition-all duration-300 mr-4`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
    color: white;
    
    &:hover {
        background: linear-gradient(135deg, #003d99 0%, #0052cc 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.4);
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const user = useStoreState((state: ApplicationStore) => state.user.data);
    const rootAdmin = user?.rootAdmin || false;
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className={'w-full shadow-md overflow-x-auto'} style={{ backgroundColor: '#000a1a', position: 'relative', zIndex: 10 }}>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[3.5rem] max-w-[1200px]'}>
                <div id={'logo'} className={'flex-1'}>
                    <Link
                        to={'/'}
                        className={
                            'text-2xl font-header px-4 no-underline text-neutral-200 hover:text-neutral-100 transition-colors duration-150'
                        }
                    >
                        {name}
                    </Link>
                </div>
                {user && (
                    <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </MobileMenuButton>
                )}
                <RightNavigation $isOpen={mobileMenuOpen}>
                    {user ? (
                        <>
                            <SearchContainer />
                            <Tooltip placement={'bottom'} content={'Server Dashboard'}>
                                <NavLink to={'/servers'} onClick={() => setMobileMenuOpen(false)}>
                                    <Layers size={20} />
                                    <span className="mobile-label">Dashboard</span>
                                </NavLink>
                            </Tooltip>
                            <Tooltip placement={'bottom'} content={'Billing'}>
                                <NavLink to={'/account'} onClick={() => setMobileMenuOpen(false)}>
                                    <CreditCard size={20} />
                                    <span className="mobile-label">Billing</span>
                                </NavLink>
                            </Tooltip>
                            {rootAdmin && (
                                <Tooltip placement={'bottom'} content={'Admin Panel'}>
                                    <a href={'/admin'} rel={'noreferrer'}>
                                        <Settings size={20} />
                                        <span className="mobile-label">Admin</span>
                                    </a>
                                </Tooltip>
                            )}
                            <Tooltip placement={'bottom'} content={'Account Settings'}>
                                <NavLink to={'/account'} onClick={() => setMobileMenuOpen(false)}>
                                    <User size={20} />
                                    <span className="mobile-label">Account</span>
                                </NavLink>
                            </Tooltip>
                            <Tooltip placement={'bottom'} content={'Sign Out'}>
                                <button onClick={() => { onTriggerLogout(); setMobileMenuOpen(false); }}>
                                    <LogOut size={20} />
                                    <span className="mobile-label">Sign Out</span>
                                </button>
                            </Tooltip>
                        </>
                    ) : (
                        <div className={'flex items-center px-4'}>
                            <LoginButton to={'/auth/login'}>
                                Login / Sign Up
                            </LoginButton>
                        </div>
                    )}
                </RightNavigation>
            </div>
        </div>
    );
};
