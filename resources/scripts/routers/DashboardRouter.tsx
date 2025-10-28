import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
// import BillingContainer from '@/components/dashboard/BillingContainer';
// import CartContainer from '@/components/store/CartContainer';
// import CheckoutContainer from '@/components/store/CheckoutContainer';
import LandingPage from '@/components/LandingPage';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import { useStoreState } from 'easy-peasy';

export default () => {
    const location = useLocation();
    const user = useStoreState((state) => state.user.data);

    return (
        <>
            <NavigationBar />
            {location.pathname.startsWith('/account') && (
                <SubNavigation>
                    <div>
                        {routes.account
                            .filter((route) => !!route.name)
                            .map(({ path, name, exact = false }) => (
                                <NavLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
                                    {name}
                                </NavLink>
                            ))}
                    </div>
                </SubNavigation>
            )}
            <TransitionRouter>
                <React.Suspense fallback={<Spinner centered />}>
                    <Switch location={location}>
                        <Route path={'/'} exact>
                            <LandingPage />
                        </Route>
                        <Route path={'/servers'} exact>
                            {user ? <DashboardContainer /> : <LandingPage />}
                        </Route>
                        {/* <Route path={'/billing'} exact>
                            {user ? <BillingContainer /> : <LandingPage />}
                        </Route> */}
                        {/* <Route path={'/cart'} exact>
                            <CartContainer />
                        </Route>
                        <Route path={'/checkout'} exact>
                            <CheckoutContainer />
                        </Route> */}
                        {routes.account.map(({ path, component: Component }) => (
                            <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                {user ? <Component /> : <LandingPage />}
                            </Route>
                        ))}
                        <Route path={'*'}>
                            <NotFound />
                        </Route>
                    </Switch>
                </React.Suspense>
            </TransitionRouter>
        </>
    );
};
