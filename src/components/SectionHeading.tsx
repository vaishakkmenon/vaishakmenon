// components/SectionHeading.tsx
type MaxWidth = "3xl" | "5xl" | "7xl" | "none";

export default function SectionHeading({
    id,
    children,
    className = "",
    bleed = false,          // edge-to-edge divider when true
    max = "5xl",            // choose container width without conflicting classes
}: {
    id?: string;
    children: React.ReactNode;
    className?: string;
    bleed?: boolean;
    max?: MaxWidth;
}) {
    const maxClass =
        max === "none" ? "" : max === "3xl" ? "max-w-3xl" : max === "7xl" ? "max-w-7xl" : "max-w-5xl";

    return (
        <div id={id} className={`mx-auto ${maxClass} px-4 scroll-mt-28 ${className}`}>
            <h2 className="text-center text-2xl md:text-3xl font-bold">{children}</h2>

            {/* Divider */}
            {bleed ? (
                <div aria-hidden className="relative mt-4 mb-8 h-px">
                    <div className="absolute left-1/2 -translate-x-1/2 h-px w-screen bg-gray-300/70 dark:bg-gray-700/70" />
                </div>
            ) : (
                <div className="mt-4 mb-8 h-px w-full bg-gray-300/70 dark:bg-gray-700/70" />
            )}
        </div>
    );
}