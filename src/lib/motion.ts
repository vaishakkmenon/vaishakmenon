export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const VIEWPORT = { once: true, amount: 0.2 } as const;
export const VARIANTS = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } } as const;
export const TRANSITION = { duration: 0.45, ease: EASE_OUT } as const;