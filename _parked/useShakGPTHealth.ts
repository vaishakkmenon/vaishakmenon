import { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '@/lib/api/chat';
import { ApiStatus } from '@/lib/types/chat';

export function useShakGPTHealth() {
    const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

    useEffect(() => {
        // Check API health on mount
        checkHealth('https://llm.vaishakmenon.com/health').then((status) => {
            setApiStatus(status.healthy ? 'healthy' : 'unhealthy');
        });
    }, []);

    const recheckHealth = useCallback(async () => {
        setApiStatus('checking');
        const status = await checkHealth('https://llm.vaishakmenon.com/health');
        setApiStatus(status.healthy ? 'healthy' : 'unhealthy');
    }, []);

    return {
        apiStatus,
        recheckHealth,
    };
}
