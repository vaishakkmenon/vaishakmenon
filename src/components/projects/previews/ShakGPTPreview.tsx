'use client';

import { useEffect, useState } from 'react';
import { PreviewWindow } from './PreviewWindow';
import { motion } from 'framer-motion';

const RESPONSE = 'Why do you think this? The name "Kenya" is a combination of two words...';

function FadeInLine({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ShakGPTPreview(): React.ReactElement {
    const [text, setText] = useState('');
    const [visibleLines, setVisibleLines] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);

    const isTypingDone = text.length >= RESPONSE.length;
    const showCursor = !isTypingDone || cursorVisible;

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleLines(prev => {
                if (prev >= 6) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 600);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (visibleLines < 6) return;
        const interval = setInterval(() => {
            setText(prev => {
                if (prev.length >= RESPONSE.length) {
                    clearInterval(interval);
                    return prev;
                }
                return RESPONSE.slice(0, prev.length + 1);
            });
        }, 55);
        return () => clearInterval(interval);
    }, [visibleLines]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <PreviewWindow label="ShakGPT">
            <div className="w-full h-full flex flex-col font-mono text-[12px] leading-relaxed">
                {visibleLines >= 1 &&
                    <FadeInLine className="text-white/40">
                        <span className="text-emerald-400">$</span>
                        <span className="text-white/40"> python generate.py</span>
                    </FadeInLine>}
                {visibleLines >= 2 &&
                    <FadeInLine className="text-white/40">
                        Loading model...
                    </FadeInLine>}
                {visibleLines >= 3 &&
                    <FadeInLine className="text-white/40">
                        Loading checkpoint...
                    </FadeInLine>}
                {visibleLines >= 4 &&
                    <FadeInLine className="text-white/40">
                        ---------------------------------------------------------
                    </FadeInLine>}
                {visibleLines >= 5 &&
                    <FadeInLine className="text-white/80 mt-3">
                        <span className="text-emerald-400">&gt;&gt;&gt;</span>
                        <span className="text-white/80"> What is your name?</span>
                    </FadeInLine>}
                {visibleLines >= 6 &&
                    <div className="text-white/60 mt-4">
                        {text}
                        <span className={`inline-block w-2 h-4 bg-emerald-400/80 ml-1 translate-y-[2px] ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
                    </div>}
                <div className="text-white/30 text-[11px] mt-auto pt-3 border-t border-white/5">
                    ShakGPT &middot; 345M params &middot; trained from scratch
                </div>
            </div>
        </PreviewWindow>
    );
}