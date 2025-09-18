// components/Header.tsx
"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeIcon } from "@/components/themeIcon"
import { ThemeToggle } from "@/components/themeToggle"

export function Header() {
    const [opacity, setOpacity] = useState(1)

    useEffect(() => {
        const fadeStart = window.innerHeight - 200
        const fadeEnd = window.innerHeight
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop
            if (y <= fadeStart) setOpacity(1)
            else if (y >= fadeEnd) setOpacity(0)
            else setOpacity(1 - (y - fadeStart) / (fadeEnd - fadeStart))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <header
            style={{ opacity, transition: "opacity .3s ease" }}
            className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40"
        >
            <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-xl">Vaishak Menon</Link>
                <nav className="flex items-center gap-3">
                    <Link href="https://linkedin.com/in/vaishakkmenon" target="_blank" aria-label="LinkedIn">
                        <ThemeIcon lightSvg="/images/linkedin-white.png" darkSvg="/images/linkedin.png" width={24} height={24} alt="LinkedIn" />
                    </Link>
                    <Link href="https://github.com/vaishakkmenon" target="_blank" aria-label="GitHub">
                        <ThemeIcon lightSvg="/images/github-white.svg" darkSvg="/images/github.svg" width={24} height={24} alt="GitHub" />
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    )
}