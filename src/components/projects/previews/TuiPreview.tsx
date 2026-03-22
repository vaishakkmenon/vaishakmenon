'use client';

import { useState, useEffect } from 'react';

export function TuiPreview(): React.ReactElement {
    const [text, setText] = useState('');
    const [cursorVisible, setCursorVisible] = useState(true);
    
    // The sequence we want to type out
    const lines = [
        "ssh guest@tui.vaishakmenon.com",
        "Loading Vaishak's Interactive Portfolio...",
        "",
        "Welcome to the Terminal User Interface (TUI).",
        "> Built in Go with Bubble Tea",
        "> Themeable TrueColor Interface",
        "> Hardened Docker Deployment",
        "",
        "Press any key to enter..."
    ];

    const fullText = lines.join('\n');

    useEffect(() => {
        let currentIndex = 0;
        
        // Typing effect
        const typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setText(fullText.substring(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 35); // Typing speed

        // Blinking cursor
        const cursorInterval = setInterval(() => {
            setCursorVisible(v => !v);
        }, 530);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, [fullText]);

    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#0d0d0d] p-4 relative overflow-hidden rounded-xl select-none font-mono">
            {/* Terminal window */}
            <div className="relative z-10 w-full h-full max-w-sm flex flex-col rounded-lg border border-white/10 shadow-2xl shadow-black/80 overflow-hidden bg-[#121212]">
                {/* Title Bar */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-white/5 shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="flex-1 text-center text-[11px] text-white/30 font-sans tracking-wide">
                        guest@tui:~
                    </span>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-5 overflow-hidden text-[12px] leading-relaxed relative">
                    {/* Render the typed text */}
                    <div className="whitespace-pre-wrap flex flex-col relative z-10">
                        {text.split('\n').map((line, i) => {
                            // Style the command prompt line differently
                            if (i === 0) {
                                return (
                                    <div key={i} className="flex">
                                        <span className="text-emerald-400 mr-2">❯</span>
                                        <span className="text-white/90">{line}</span>
                                        {text.split('\n').length === 1 && (
                                            <span className={`inline-block w-2 h-4 bg-emerald-400/80 ml-1 translate-y-[2px] ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                                        )}
                                    </div>
                                );
                            }
                            
                            // Style bullet points
                            if (line.startsWith('>')) {
                                return (
                                    <div key={i} className="text-emerald-400/80 pl-2">
                                        {line}
                                        {i === text.split('\n').length - 1 && (
                                            <span className={`inline-block w-2 h-4 bg-emerald-400/80 ml-1 translate-y-[2px] ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                                        )}
                                    </div>
                                );
                            }

                            // Normal lines
                            return (
                                <div key={i} className="text-white/70 min-h-[18px]">
                                    {line}
                                    {i === text.split('\n').length - 1 && (
                                        <span className={`inline-block w-2 h-4 bg-emerald-400/80 ml-1 translate-y-[2px] ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Scanlines overlay on the screen content */}
                    <div 
                        className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }}
                    />
                </div>
            </div>
        </div>
    );
}
