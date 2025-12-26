'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    initialDelay?: number;
}

export function TypewriterText({
    texts,
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseDuration = 2000,
    initialDelay = 0,
}: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasStarted, setHasStarted] = useState(initialDelay === 0);

    // Handle initial delay
    useEffect(() => {
        if (initialDelay > 0) {
            const timer = setTimeout(() => setHasStarted(true), initialDelay);
            return () => clearTimeout(timer);
        }
    }, [initialDelay]);

    useEffect(() => {
        if (!hasStarted) return;

        const currentText = texts[textIndex];

        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimer);
        }

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentText.length) {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                } else {
                    // Finished typing, pause before deleting
                    setIsPaused(true);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    // Finished deleting, move to next text
                    setIsDeleting(false);
                    setTextIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, textIndex, isDeleting, isPaused, hasStarted, texts, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className="inline-flex items-center">
            {displayText}
            {hasStarted && <span className="ml-0.5 w-[2px] h-[1.2em] bg-current animate-pulse" />}
        </span>
    );
}
