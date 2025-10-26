import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faRetweet, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const FooterContainer = styled.footer`
    ${tw`py-12 px-4 border-t`};
    background-color: #000a1a;
    border-top: 1px solid rgba(0, 102, 255, 0.3);
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto`};
`;

const TopSection = styled.div`
    ${tw`mb-12 pb-8 border-b border-neutral-700`};
`;

const Logo = styled.div`
    ${tw`text-3xl font-bold mb-4`};
    color: #0066ff;
`;

const Tagline = styled.p`
    ${tw`text-neutral-400 mb-6`};
`;

const SocialLinks = styled.div`
    ${tw`flex gap-4 mb-4`};
`;

const SocialLink = styled.a`
    ${tw`text-2xl transition-all duration-200`};
    color: #0066ff;
    
    &:hover {
        color: #0052cc;
        transform: scale(1.1);
    }
`;

const TrustScore = styled.div`
    ${tw`text-sm`};
`;

const Stars = styled.span`
    ${tw`text-yellow-400 mr-2`};
`;

const Grid = styled.div`
    ${tw`grid md:grid-cols-4 gap-8 mb-8`};
`;

const Column = styled.div`
    ${tw``};
`;

const ColumnTitle = styled.h4`
    ${tw`text-lg font-bold mb-4`};
    color: #0066ff;
`;

const LinkList = styled.ul`
    ${tw`space-y-2`};
`;

const FooterLink = styled(Link)`
    ${tw`text-neutral-300 hover:text-white transition-colors duration-200 block text-sm`};
`;

const ExternalLink = styled.a`
    ${tw`text-neutral-300 hover:text-white transition-colors duration-200 block text-sm`};
`;

const BottomBar = styled.div`
    ${tw`pt-8 border-t border-neutral-700 text-center text-neutral-400 text-sm`};
`;

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <Container>
                <TopSection>
                    <Logo>GAMECONTROL</Logo>
                    <Tagline>Premium Game Server Hosting Since 2025</Tagline>
                    <SocialLinks>
                        <SocialLink href="https://discord.gg/your-server" target="_blank" title="Discord">
                            <FontAwesomeIcon icon={faComments} />
                        </SocialLink>
                        <SocialLink href="https://twitter.com/your-handle" target="_blank" title="Twitter">
                            <FontAwesomeIcon icon={faRetweet} />
                        </SocialLink>
                        <SocialLink href="https://facebook.com/your-page" target="_blank" title="Facebook">
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </SocialLink>
                    </SocialLinks>
                    <TrustScore>
                        <Stars>★★★★★</Stars>
                        <span className="text-white font-semibold">Excellent</span> | 250 reviews
                    </TrustScore>
                </TopSection>
                
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

