import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-neutral-300 px-6 cursor-pointer transition-all duration-150`};

        &:active,
        &:hover {
            ${tw`text-neutral-100 bg-black`};
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px ${theme`colors.cyan.600`.toString()};
        }
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

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className={'w-full bg-neutral-900 shadow-md overflow-x-auto'}>
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
                <RightNavigation className={'flex h-full items-center justify-center'}>
                    {user ? (
                        <>
                            <SearchContainer />
                            <Tooltip placement={'bottom'} content={'Server Dashboard'}>
                                <NavLink to={'/servers'}>
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </NavLink>
                            </Tooltip>
                            {rootAdmin && (
                                <Tooltip placement={'bottom'} content={'Admin Panel'}>
                                    <a href={'/admin'} rel={'noreferrer'}>
                                        <FontAwesomeIcon icon={faCogs} />
                                    </a>
                                </Tooltip>
                            )}
                            <Tooltip placement={'bottom'} content={'Account Settings'}>
                                <NavLink to={'/account'}>
                                    <span className={'flex items-center w-5 h-5'}>
                                        <Avatar.User />
                                    </span>
                                </NavLink>
                            </Tooltip>
                            <Tooltip placement={'bottom'} content={'Sign Out'}>
                                <button onClick={onTriggerLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} />
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
