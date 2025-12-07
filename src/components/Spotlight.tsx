"use client";
import { useEffect } from "react";

/**
 * Mouse-following spotlight effect overlay
 *
 * Creates a gradient spotlight that follows the mouse cursor.
 * Automatically disabled for users with prefers-reduced-motion.
 * Uses CSS custom properties (--mx, --my) for positioning.
 *
 * Performance optimized with requestAnimationFrame throttling.
 *
 * @returns Spotlight overlay element
 *
 * @example
 * ```tsx
 * <Spotlight />
 * ```
 */
export default function Spotlight(): React.ReactElement {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

        const root = document.documentElement;
        if (!root) return;

        try {
            root.style.setProperty("--mx", root.style.getPropertyValue("--mx") || "50%");
            root.style.setProperty("--my", root.style.getPropertyValue("--my") || "30%");
        } catch (error) {
            console.error("Failed to initialize spotlight:", error);
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.debug("Spotlight mounted — writing --mx/--my on mousemove");
        }

        let frameId: number | null = null;

        const onMove = (e: MouseEvent): void => {
            // Throttle with requestAnimationFrame
            if (frameId) return;

            frameId = requestAnimationFrame(() => {
                try {
                    if (root) {
                        root.style.setProperty("--mx", `${e.clientX}px`);
                        root.style.setProperty("--my", `${e.clientY}px`);
                    }
                } catch (error) {
                    console.error("Failed to update spotlight:", error);
                }
                frameId = null;
            });
        };

        window.addEventListener("mousemove", onMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMove);
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, []);

    return <div aria-hidden className="spotlight" />;
}