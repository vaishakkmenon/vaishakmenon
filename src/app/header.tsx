// components/Header.tsx
"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ThemeIcon } from "@/components/themeIcon";
import { ThemeToggle } from "@/components/themeToggle"

export function Header() {
    const [opacity, setOpacity] = useState(1)

    useEffect(() => {
        const container = document.getElementById("scroll-container")
        if (!container) return

        const fadeStart = window.innerHeight - 200
        const fadeEnd = window.innerHeight

        const onScroll = () => {
            const y = container.scrollTop
            if (y <= fadeStart) {
                setOpacity(1)
            } else if (y >= fadeEnd) {
                setOpacity(0)
            } else {
                const t = (y - fadeStart) / (fadeEnd - fadeStart)
                setOpacity(1 - t)
            }
        }

        container.addEventListener("scroll", onScroll, { passive: true })
        return () => container.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header
            style={{
                opacity,
                pointerEvents: opacity === 0 ? "none" : undefined,
                transition: "opacity 0.3s ease-in-out",
            }}
            className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3"
        >
            <div className="flex items-center">
                <Sidebar />
            </div>
            <div className="flex items-center space-x-2">
                <Link href="/" className="site-title font-bold text-lg">
                    Vaishak Menon
                </Link>
                {/* LinkedIn */}
                <Link href="https://linkedin.com/in/your-profile" target="_blank">
                    <ThemeIcon
                        lightSvg="/linkedin-white.png"
                        darkSvg="/linkedin.png"
                        width={24}
                        height={24}
                        alt="LinkedIn"
                    />
                </Link>

                {/* GitHub */}
                <Link href="https://github.com/your-username" target="_blank">
                    <ThemeIcon
                        lightSvg="/github-white.svg"
                        darkSvg="/github.svg"
                        width={24}
                        height={24}
                        alt="GitHub"
                    />
                </Link>
            </div>
            <div className="flex items-center">
                <ThemeToggle />
            </div>
        </header>
    )
}
