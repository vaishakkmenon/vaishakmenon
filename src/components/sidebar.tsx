"use client";

import { useState } from "react";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger trigger */}
            <button
                onClick={() => setIsOpen(true)}
                aria-controls="drawer-navigation"
                aria-label="Open menu"
                className="
                    p-2 rounded-md
                    hover:bg-gray-700 hover:text-white
                    dark:hover:bg-gray-300 dark:hover:text-black"
            >
                <svg
                    className="w-6 h-6 text-black dark:text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="4"
                        y="5"
                        width="16"
                        height="2"
                        rx="1"
                        fill="currentColor"
                        stroke="none"
                    />
                    <rect
                        x="4"
                        y="11"
                        width="16"
                        height="2"
                        rx="1"
                        fill="currentColor"
                        stroke="none"
                    />
                    <rect
                        x="4"
                        y="17"
                        width="16"
                        height="2"
                        rx="1"
                        fill="currentColor"
                        stroke="none"
                    />
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="butt"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Off-canvas Drawer */}
            < Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)
                }
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
            </Drawer >
        </>
    );
}
