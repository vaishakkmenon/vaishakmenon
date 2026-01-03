// hooks/useKeybind.ts
import { useEffect } from 'react';

type KeyCombo = {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean; // Command key on Mac
    shiftKey?: boolean;
    altKey?: boolean;
};

type Options = {
    enabled?: boolean;
    ignoreInput?: boolean;     // Defaults to true: Don't trigger inside inputs
    preventDefault?: boolean;  // Defaults to true: Stop browser default behavior
};

export function useKeybind(
    combo: KeyCombo,
    callback: (event: KeyboardEvent) => void,
    options: Options = {}
) {
    // Set defaults
    const {
        enabled = true,
        ignoreInput = true,
        preventDefault = true
    } = options;

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // 1. INPUT SAFETY CHECK
            // Prevents shortcuts from firing while typing in forms
            if (ignoreInput) {
                const target = event.target as HTMLElement;
                const isInput =
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable;

                if (isInput) return;
            }

            // 2. Check Key Match (Case-insensitive)
            if (event.key.toLowerCase() !== combo.key.toLowerCase()) return;

            // 3. Check Modifiers
            // We use !! to convert undefined/null to false for strict boolean comparison
            if (!!event.ctrlKey !== !!combo.ctrlKey) return;
            if (!!event.metaKey !== !!combo.metaKey) return;
            if (!!event.shiftKey !== !!combo.shiftKey) return;
            if (!!event.altKey !== !!combo.altKey) return;

            // 4. Prevent Default Browser Action
            if (preventDefault) {
                event.preventDefault();
            }

            callback(event);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [combo, callback, enabled, ignoreInput, preventDefault]);
}