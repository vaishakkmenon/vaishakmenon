// ShakGPT page

'use client';

import { useShakGPTHealth } from '@/hooks/useShakGPTHealth';
import { ShakGPTHero } from '@/components/shakgpt/ShakGPTHero';
import { BabbleFeedCard } from '@/components/shakgpt/BabbleFeed';
import { ShakGPTPlayground } from '@/components/shakgpt/ShakGPTPlayground';

export default function ShakGPTPage() {
    const { apiStatus, recheckHealth } = useShakGPTHealth();

    return (
        <main>
            <ShakGPTHero apiStatus={apiStatus} recheckHealth={recheckHealth} />
            <BabbleFeedCard />
            <ShakGPTPlayground apiStatus={apiStatus} />
        </main>
    );
}
