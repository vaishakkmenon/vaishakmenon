// components/SectionHeading.tsx

/**
 * Reusable section heading component with optional divider
 *
 * @param id - Optional ID for the heading element (for anchor links)
 * @param children - Heading text content
 * @param className - Additional CSS classes
 * @param bleed - If true, divider extends full viewport width
 * @param max - Maximum width constraint (3xl, 5xl, 7xl, or none)
 *
 * @returns Section heading with optional divider
 *
 * @example
 * ```tsx
 * <SectionHeading id="about" max="3xl">About Me</SectionHeading>
 * ```
 */
type MaxWidth = '3xl' | '5xl' | '7xl' | 'none';

export default function SectionHeading({
    id,
    children,
    className = '',
    bleed = false,          // edge-to-edge divider when true
    max = '5xl',            // choose container width without conflicting classes
}: {
    id?: string;
    children: React.ReactNode;
    className?: string;
    bleed?: boolean;
    max?: MaxWidth;
}): React.ReactElement {
    const maxClass =
        max === 'none' ? '' : max === '3xl' ? 'max-w-3xl' : max === '7xl' ? 'max-w-7xl' : 'max-w-5xl';

    return (
        <div id={id} className={`mx-auto ${maxClass} px-4 scroll-mt-28 ${className}`}>
            <h2 className="text-center text-2xl md:text-3xl font-bold">{children}</h2>

            {/* Divider */}
            {bleed ? (
                <div aria-hidden className="relative mt-4 mb-8 h-px">
                    <div
                        className="absolute left-1/2 -translate-x-1/2 h-px w-screen"
                        style={{ backgroundColor: 'var(--color-divider)' }}
                    />
                </div>
            ) : (
                <div
                    className="mt-4 mb-8 h-px w-full"
                    style={{ backgroundColor: 'var(--color-divider)' }}
                />
            )}
        </div>
    );
}