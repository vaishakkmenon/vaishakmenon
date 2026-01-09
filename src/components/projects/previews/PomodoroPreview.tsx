'use client';

import {
    Menu,
    Settings,
    Play,
    RotateCcw,
    Music,
    Youtube,
    CloudRain,
    ChevronLeft,
    X,
    ChevronRight,
    UserCircle
} from 'lucide-react';

export function PomodoroPreview(): React.ReactElement {
    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#18181b] p-4 relative overflow-hidden rounded-xl font-sans select-none">
            {/* Background elements */}
            {/* <div className="absolute top-4 right-4 text-white/20">
                <UserCircle className="w-8 h-8" />
            </div> */}

            <div className="flex gap-4 items-start scale-90 sm:scale-100 transition-transform">
                {/* Media Dock (Sidebar) */}
                <div className="flex flex-col gap-3 p-2 bg-white/5 rounded-2xl border border-white/5 shadow-2xl z-10 backdrop-blur-sm cursor-default">
                    <div className="p-2 text-white/40">
                        <X className="w-4 h-4" />
                    </div>
                    <div className="p-2 text-white/40 bg-white/5 rounded-lg">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <div className="h-px w-full bg-white/5 my-1" />
                    <div className="p-2 text-white/40">
                        <Music className="w-4 h-4" />
                    </div>
                    <div className="p-2 text-white/40">
                        <Youtube className="w-4 h-4" />
                    </div>
                    <div className="p-2 text-white/40">
                        <CloudRain className="w-4 h-4" />
                    </div>
                </div>

                {/* Main Content Info */}
                <div className="flex flex-col gap-4">
                    {/* Timer Card */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-2xl w-[320px] relative backdrop-blur-sm">
                        {/* Card Header */}
                        <div className="flex justify-between items-center mb-8 cursor-default">
                            <Menu className="w-5 h-5 text-white/60" />
                            <div className="px-4 py-1.5 rounded-full bg-transparent border border-[#10b981]/40">
                                <span className="text-[11px] font-bold tracking-wider text-[#10b981] uppercase">Study Time — Paused</span>
                            </div>
                            <Settings className="w-5 h-5 text-white/60" />
                        </div>

                        {/* Timer Display */}
                        <div className="text-center mb-8">
                            <div className="text-7xl font-bold text-white tracking-tight tabular-nums">
                                25:00
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 justify-center cursor-default">
                            <div className="px-8 py-2.5 rounded-xl bg-[#10b981]/20 text-[#10b981] font-medium text-sm border border-white/5">
                                Start
                            </div>
                            <div className="px-8 py-2.5 rounded-xl bg-[#ef4444]/10 text-[#ef4444] font-medium text-sm border border-white/5">
                                Reset
                            </div>
                        </div>
                    </div>

                    {/* Task Bar */}
                    <div className="flex items-center gap-2 text-white/40 text-sm pl-2">
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-medium">Tasks</span>
                        <span className="text-xs opacity-60">0/0</span>
                        <div className="h-px flex-1 bg-white/10 ml-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
