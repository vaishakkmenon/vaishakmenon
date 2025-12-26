// Animated skeleton placeholder component

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

/**
 * Skeleton loading placeholder with pulse animation.
 * Use for loading states before content is available.
 */
export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-zinc-200 dark:bg-zinc-700';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}

/**
 * Pre-built skeleton for card components
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`rounded-2xl border border-zinc-200 dark:border-white/10 p-6 ${className}`}>
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
        </div>
    );
}

/**
 * Pre-built skeleton for image placeholders
 */
export function ImageSkeleton({ className = '' }: { className?: string }) {
    return (
        <Skeleton
            variant="rectangular"
            className={`aspect-square ${className}`}
        />
    );
}
