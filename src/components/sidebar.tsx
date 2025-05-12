"use client";

import { useState } from "react";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useTheme } from './themeContext';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    // Determine stroke color based on theme AND hover state
    const getStrokeColor = () => {
        if (isHovered) {
            return theme === 'dark' ? '#000000' : '#ffffff'; // Hover colors (inverted)
        } else {
            return theme === 'dark' ? '#ffffff' : '#000000'; // Default colors
        }
    };

    return (
        <>
            {/* Hamburger trigger */}
            <button
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-controls="drawer-navigation"
                aria-label="Open menu"
                className={`
                    p-2 rounded-md
                    ${isHovered
                        ? (theme === 'dark' ? 'bg-gray-300 text-black' : 'bg-gray-700 text-white')
                        : ''
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
            >
                <div className="h-full w-64 bg-black text-white flex flex-col">
                    <DrawerHeader
                        title="Menu"
                        className="border-b border-current text-white"
                    />
                    <DrawerItems className="pt-4">
                        <a href="/" className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:text-black">Home</a>
                        <a href="/about" className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:text-black">About</a>
                        <a href="/contact" className="flex items-center gap-2 p-2 hover:bg-gray-100 hover:text-black">Contact</a>
                    </DrawerItems>
                </div>
            </Drawer>
        </>
    );
}