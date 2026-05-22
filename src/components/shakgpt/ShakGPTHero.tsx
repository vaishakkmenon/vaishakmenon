import { ApiStatus } from "@/lib/types/chat"

const statusConfig = {
    checking: { label: 'Checking...', className: 'bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-500' },
    healthy: { label: 'Live', className: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400' },
    unhealthy: { label: 'Offline', className: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' },
};

interface ShakGPTHeroProps {
    apiStatus: ApiStatus;
    recheckHealth: () => void;
}

export function ShakGPTHero({ apiStatus, recheckHealth }: ShakGPTHeroProps): React.ReactElement {
    const { label, className } = statusConfig[apiStatus];

    return (
        <section className="min-h-[60vh] flex items-center">
            <div className="mx-auto max-w-5xl px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    ShakGPT
                </h1>
                <p className="mt-2 md:mt-4 text-lg md:text-xl">
                    A 345M parameter language model, built and trained from scratch.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                        345M Parameters
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                        24 Layers
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                        7B Training Tokens
                    </div>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                        Q4_K_M Quantization
                    </div>
                    <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${className}`}
                    >
                        {label}
                    </div>
                </div>
            </div>
        </section>
    )
};