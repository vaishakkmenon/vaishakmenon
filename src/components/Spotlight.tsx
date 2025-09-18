"use client";
import { useEffect } from "react";

export default function Spotlight() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        // Respect reduced motion
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const root = document.documentElement;
        // set sane defaults (percentages) so spotlight is visible before first mousemove
        root.style.setProperty("--mx", root.style.getPropertyValue("--mx") || "50%");
        root.style.setProperty("--my", root.style.getPropertyValue("--my") || "30%");

        // small console debug to confirm mount
        // remove after you verify it runs
        // eslint-disable-next-line no-console
        console.log("Spotlight mounted — writing --mx/--my on mousemove");

        const onMove = (e: MouseEvent) => {
            root.style.setProperty("--mx", `${e.clientX}px`);
            root.style.setProperty("--my", `${e.clientY}px`);
        };

        window.addEventListener("mousemove", onMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMove);
        };
    }, []);

    return <div aria-hidden className="spotlight" />;
}