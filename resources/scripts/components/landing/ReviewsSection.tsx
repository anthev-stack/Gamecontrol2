import React from 'react';
import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Section = styled.section`
    ${tw`py-20 px-4`};
    background-color: #000a1a;
`;

const Container = styled.div`
    ${tw`max-w-7xl mx-auto`};
`;

const Grid = styled.div`
    ${tw`grid md:grid-cols-4 gap-6`};
`;

const TrustpilotCard = styled.div`
    ${tw`p-8 rounded-xl text-center`};
    background: linear-gradient(135deg, #0052cc 0%, #0066ff 100%);
`;

const TrustpilotLogo = styled.div`
    ${tw`text-2xl font-bold mb-2 text-white`};
`;

const Rating = styled.div`
    ${tw`text-3xl font-bold mb-2 text-white`};
`;

const Stars = styled.div`
    ${tw`text-4xl mb-2 text-yellow-400`};
`;

const ReviewCount = styled.div`
    ${tw`text-white text-sm`};
`;

const ReviewCard = styled.div`
    ${tw`p-6 rounded-xl`};
    background-color: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 102, 255, 0.2);
`;

const ReviewStars = styled.div`
    ${tw`mb-3 text-yellow-400`};
`;

const ReviewerName = styled.div`
    ${tw`font-bold mb-2 text-white`};
`;

const ReviewText = styled.p`
    ${tw`text-neutral-300 mb-3 text-sm leading-relaxed`};
`;

const ReviewDate = styled.div`
    ${tw`text-xs text-neutral-400`};
`;

const ReviewsSection: React.FC = () => {
    return (
        <Section>
            <Container>
                <Grid>
                    {/* Trustpilot Widget */}
                    <TrustpilotCard>
                        <TrustpilotLogo>⭐ Reviews</TrustpilotLogo>
                        <Rating>4.9/5.0</Rating>
                        <Stars>★★★★★</Stars>
                        <ReviewCount>Excellent</ReviewCount>
                        <ReviewCount className="mt-2">250+ Reviews</ReviewCount>
                    </TrustpilotCard>

                    {/* Review 1 */}
                    <ReviewCard>
                        <ReviewStars>★★★★★</ReviewStars>
                        <ReviewerName>John Smith</ReviewerName>
                        <ReviewText>
                            "Amazing service! Setup was instant and the control panel is super easy to use. 
                            My Minecraft server has been running flawlessly for 6 months."
                        </ReviewText>
                        <ReviewDate>15 September 2025</ReviewDate>
                    </ReviewCard>

                    {/* Review 2 */}
                    <ReviewCard>
                        <ReviewStars>★★★★★</ReviewStars>
                        <ReviewerName>Sarah Johnson</ReviewerName>
                        <ReviewText>
                            "The split billing feature is genius! Me and my friends share our CS2 server costs 
                            and everyone has full access. Support team is incredibly helpful."
                        </ReviewText>
                        <ReviewDate>8 October 2025</ReviewDate>
                    </ReviewCard>

                    {/* Review 3 */}
                    <ReviewCard>
                        <ReviewStars>★★★★★</ReviewStars>
                        <ReviewerName>Mike Chen</ReviewerName>
                        <ReviewText>
                            "Best Rust hosting I've tried. Zero lag, great uptime, and the hardware specs 
                            are exactly as advertised. Highly recommend!"
                        </ReviewText>
                        <ReviewDate>22 October 2025</ReviewDate>
                    </ReviewCard>
                </Grid>
            </Container>
        </Section>
    );
};

export default ReviewsSection;

