'use client';

export function ChatPreview(): React.ReactElement {
    return (
        <>
            <div className="flex items-center gap-2 mb-4 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">AI</span>
                    </div>
                    <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-transparent rounded-lg rounded-tl-none p-3 max-w-[85%] text-zinc-600 dark:text-zinc-300 shadow-sm dark:shadow-none">
                        <p>Hello! I can answer questions about Vaishak&apos;s experience with Python, Kubernetes, and Cloud platforms. What would you like to know?</p>
                    </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">You</span>
                    </div>
                    <div className="bg-blue-600 dark:bg-blue-600/20 border border-transparent dark:border-blue-500/30 rounded-lg rounded-tr-none p-3 max-w-[85%] text-white dark:text-blue-100 shadow-sm dark:shadow-none">
                        <p>How much experience does he have with AWS?</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">AI</span>
                    </div>
                    <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-transparent rounded-lg rounded-tl-none p-3 max-w-[85%] text-zinc-600 dark:text-zinc-300 shadow-sm dark:shadow-none">
                        <p>Vaishak is a Certified AWS Cloud Practitioner (May 2025) and AWS AI Practitioner (June 2025). He has hands-on experience deploying scalable applications...</p>
                        <div className="mt-2 flex gap-1">
                            <div className="h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-white/10" />
                            <div className="h-1.5 w-8 rounded-full bg-zinc-200 dark:bg-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
