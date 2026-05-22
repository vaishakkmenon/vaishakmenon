export function BabbleFeedCard(): React.ReactElement {
    return (
        <section>
            <div className="mx-auto max-w-5xl px-4 py-16 min-h-[280px]">
                <div className=" rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 min-h-[200px] flex flex-col items-center justify-center p-8">
                    <h2 className="text-xl font-bold mb-2">Live Babble Feed</h2>
                    <p className="text-zinc-400 dark:text-zinc-400 text-sm mt-2 mb-4">
                        Continuous stream of nonsense tokens from the beloved ShakGPT running on my personal Raspberry Pi.
                    </p>
                    <div
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                    >
                        Coming Soon!
                    </div>
                </div>
            </div>
        </section >
    );
}