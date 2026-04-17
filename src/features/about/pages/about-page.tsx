'use client';

import { AboutHero } from '../components/about-hero';
import { MissionVision } from '../components/mission-vision';
import { OurTeam } from '../components/our-team';
import { SocialProof } from '../components/social-proof';
import { ContactCTA } from '../components/contact-cta';

export const AboutPage = () => {
    return (
        <main className="w-full min-h-screen flex flex-col bg-brand-bg relative selection:bg-brand-pink/20 selection:text-brand-choco">
            <AboutHero />
            <MissionVision />
            <OurTeam />
            <SocialProof />
            <ContactCTA />
        </main>
    );
};
