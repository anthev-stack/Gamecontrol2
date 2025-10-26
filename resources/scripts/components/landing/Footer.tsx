import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const FooterContainer = styled.footer`
    ${tw`py-12 px-4 border-t`};
    background-color: #000a1a;
    border-top: 1px solid rgba(0, 102, 255, 0.3);
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto`};
`;

const Grid = styled.div`
    ${tw`grid md:grid-cols-4 gap-8 mb-8`};
`;

const Column = styled.div`
    ${tw``};
`;

const ColumnTitle = styled.h4`
    ${tw`text-lg font-bold mb-4 text-white`};
`;

const LinkList = styled.ul`
    ${tw`space-y-2`};
`;

const FooterLink = styled(Link)`
    ${tw`text-neutral-300 hover:text-white transition-colors duration-200 block`};
`;

const ExternalLink = styled.a`
    ${tw`text-neutral-300 hover:text-white transition-colors duration-200 block`};
`;

const BottomBar = styled.div`
    ${tw`pt-8 border-t border-neutral-700 text-center text-neutral-400`};
`;

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <Container>
                <Grid>
                    {/* Games */}
                    <Column>
                        <ColumnTitle>Games</ColumnTitle>
                        <LinkList>
                            <li><FooterLink to="/auth/login">Minecraft Hosting</FooterLink></li>
                            <li><FooterLink to="/auth/login">CS2 Hosting</FooterLink></li>
                            <li><FooterLink to="/auth/login">Rust Hosting</FooterLink></li>
                            <li><FooterLink to="/auth/login">ARK Hosting</FooterLink></li>
                            <li><FooterLink to="/auth/login">Garry's Mod</FooterLink></li>
                            <li><FooterLink to="/auth/login">All Games</FooterLink></li>
                        </LinkList>
                    </Column>

                    {/* Company */}
                    <Column>
                        <ColumnTitle>Company</ColumnTitle>
                        <LinkList>
                            <li><FooterLink to="/">About Us</FooterLink></li>
                            <li><FooterLink to="/">Our Team</FooterLink></li>
                            <li><FooterLink to="/">Careers</FooterLink></li>
                            <li><FooterLink to="/">Partners</FooterLink></li>
                            <li><FooterLink to="/">Affiliates</FooterLink></li>
                            <li><FooterLink to="/">Blog</FooterLink></li>
                        </LinkList>
                    </Column>

                    {/* Support */}
                    <Column>
                        <ColumnTitle>Support</ColumnTitle>
                        <LinkList>
                            <li><ExternalLink href="https://discord.gg/your-server" target="_blank">Discord</ExternalLink></li>
                            <li><FooterLink to="/">Help Center</FooterLink></li>
                            <li><FooterLink to="/">Documentation</FooterLink></li>
                            <li><FooterLink to="/">Server Status</FooterLink></li>
                            <li><FooterLink to="/">Contact Us</FooterLink></li>
                            <li><FooterLink to="/">Report Abuse</FooterLink></li>
                        </LinkList>
                    </Column>

                    {/* Information */}
                    <Column>
                        <ColumnTitle>Information</ColumnTitle>
                        <LinkList>
                            <li><FooterLink to="/">Terms of Service</FooterLink></li>
                            <li><FooterLink to="/">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/">Refund Policy</FooterLink></li>
                            <li><FooterLink to="/">Acceptable Use</FooterLink></li>
                            <li><FooterLink to="/">SLA</FooterLink></li>
                            <li><FooterLink to="/">GDPR</FooterLink></li>
                        </LinkList>
                    </Column>
                </Grid>

                <BottomBar>
                    <p>&copy; {new Date().getFullYear()} GameControl. All rights reserved.</p>
                    <p className="mt-2 text-sm">Powered by premium infrastructure for the ultimate gaming experience.</p>
                </BottomBar>
            </Container>
        </FooterContainer>
    );
};

export default Footer;

