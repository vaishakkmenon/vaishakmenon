// components/sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // avoid SSR/theme flash
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { theme, systemTheme } = useTheme();
    const current = theme === "system" ? systemTheme : theme;

    // now base everything on `current`
    const getStrokeColor = () => {
        if (!mounted) return "#000000"; // Default before hydration

        if (isHovered) {
            return current === "dark" ? "#ffffff" : "#000000"; // Fixed inverted colors here
        }
        return current === "dark" ? "#ffffff" : "#000000";
    };

    if (!mounted) {
        // Return a placeholder with same dimensions to avoid layout shift
        return (
            <div className="w-6 h-6 p-2"></div>
        );
    }

    return (
        <>
            {/* Hamburger trigger */}
            <button
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-controls="drawer-navigation"
                aria-label="Open menu"
                className={`p-2 rounded-md transition-colors
                ${isHovered
                        ? current === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-gray-200 text-black"
                        : ""
                    }
                `}
            >
                <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke={getStrokeColor()}
                    fill="none"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Off-canvas Drawer */}
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                position="left"
                backdrop={true}
                edge={false}
                id="drawer-navigation"
                className="!bg-black !text-white"
            >
                <div className="h-full w-64 bg-black text-white flex flex-col">
                    <DrawerHeader
                        title="Menu"
                        className="border-b border-gray-700 text-white"
                    />
                    <DrawerItems className="pt-4">
                        <a
                            href="/"
                            className="flex items-center gap-2 p-2 text-white hover:bg-gray-800"
                        >
                            Home
                        </a>
                        <a
                            href="/about"
                            className="flex items-center gap-2 p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            About
                        </a>
                        <a
                            href="/contact"
                            className="flex items-center gap-2 p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Contact
                        </a>
                    </DrawerItems>
                </div>
            </Drawer>
        </>
    );
}