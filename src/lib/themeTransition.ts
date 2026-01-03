/**
 * ThemeTransitionManager - View Transitions with Mask Tile Reveal
 *
 * Uses pixel-precise runtime calculations to eliminate sub-pixel bleeding.
 * Grid lines and mask tiles are computed at exact integer pixel positions
 * based on the current viewport size, ensuring perfect alignment across
 * all browsers without mixed percentage/pixel rounding issues.
 */

// Configuration
const GRID_COLS = 4;
const GRID_ROWS = 4;
const TOTAL_TILES = GRID_COLS * GRID_ROWS;

// Timing
const LINE_DRAW_DURATION = 800;  // Time to draw/undraw lines
const REVEAL_DURATION = 2500;    // Time for tiles to disintegrate
const CIRCULAR_REVEAL_DURATION = 500; // Time for circular reveal fallback
const FADE_DURATION = 300; // Time for fade fallback (each direction)

// Line Colors Logic
const LINE_COLORS = {
    dark: {
        start: 'rgba(255, 255, 255, 0.4)',
        end: 'rgba(0, 0, 0, 0.3)'
    },
    light: {
        start: 'rgba(0, 0, 0, 0.25)',
        end: 'rgba(255, 255, 255, 0.4)'
    },
} as const;

type Theme = 'dark' | 'light';

interface ClickPosition {
    x: number;
    y: number;
}

function supportsViewTransitions(): boolean {
    return typeof document !== 'undefined' &&
        typeof document.startViewTransition === 'function';
}

/**
 * Generate reveal order - COMPLETELY RANDOM
 */
function generateRevealOrder(): number[] {
    const indices = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
}

/**
 * Calculate pixel-precise tile geometry to eliminate sub-pixel bleeding.
 *
 * The grid lines are 1px wide and centered on percentage positions (25%, 50%, 75%).
 * Each line covers [position - 0.5px, position + 0.5px].
 *
 * Tiles must fit exactly between line edges:
 * - Edge tiles (col 0, row 0): start at 0, end at line left edge
 * - Inner tiles: start at previous line right edge, end at next line left edge
 * - Edge tiles (col 3, row 3): start at line right edge, end at viewport edge
 */
function calculateTileGeometry(): {
    positions: string[];
    sizes: { w: number; h: number }[];
} {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Calculate exact pixel positions for grid line centers (rounded)
    const colLineCenters = [0.25, 0.5, 0.75].map(p => Math.round(p * vw));
    const rowLineCenters = [0.25, 0.5, 0.75].map(p => Math.round(p * vh));

    // Build column boundaries: each tile spans from one edge to the next
    // Line at X covers [X, X+1) in integer pixels (we treat 1px line as occupying 1 pixel)
    const colStarts: number[] = [];
    const colEnds: number[] = [];

    for (let col = 0; col < GRID_COLS; col++) {
        if (col === 0) {
            colStarts.push(0);
            colEnds.push(colLineCenters[0]); // End at line center (line covers this pixel)
        } else if (col === GRID_COLS - 1) {
            colStarts.push(colLineCenters[col - 1] + 1); // Start after line
            colEnds.push(vw);
        } else {
            colStarts.push(colLineCenters[col - 1] + 1); // Start after previous line
            colEnds.push(colLineCenters[col]); // End at current line center
        }
    }

    // Build row boundaries
    const rowStarts: number[] = [];
    const rowEnds: number[] = [];

    for (let row = 0; row < GRID_ROWS; row++) {
        if (row === 0) {
            rowStarts.push(0);
            rowEnds.push(rowLineCenters[0]);
        } else if (row === GRID_ROWS - 1) {
            rowStarts.push(rowLineCenters[row - 1] + 1);
            rowEnds.push(vh);
        } else {
            rowStarts.push(rowLineCenters[row - 1] + 1);
            rowEnds.push(rowLineCenters[row]);
        }
    }

    // Generate positions and sizes for each tile
    const positions: string[] = [];
    const sizes: { w: number; h: number }[] = [];

    for (let i = 0; i < TOTAL_TILES; i++) {
        const row = Math.floor(i / GRID_COLS);
        const col = i % GRID_COLS;

        const x = colStarts[col];
        const y = rowStarts[row];
        const w = colEnds[col] - colStarts[col];
        const h = rowEnds[row] - rowStarts[row];

        positions.push(`${x}px ${y}px`);
        sizes.push({ w, h });
    }

    return { positions, sizes };
}

/**
 * Generate CSS: Constant mask-image list, animating mask-size
 * Uses pixel-precise calculations to eliminate sub-pixel bleeding.
 */
function generateViewTransitionCSS(): string {
    const revealOrder = generateRevealOrder();
    const { positions, sizes } = calculateTileGeometry();

    // Generate constant mask-image and mask-position
    const allImages = Array(TOTAL_TILES).fill('linear-gradient(#000,#000)').join(',');
    const maskPositionsStr = positions.join(',');

    // Generate keyframes with pixel-precise sizes
    let keyframes = '';

    for (let step = 0; step <= TOTAL_TILES; step++) {
        const percent = (step / TOTAL_TILES) * 100;

        const sizeValues: string[] = [];
        for (let i = 0; i < TOTAL_TILES; i++) {
            const orderIndex = revealOrder.indexOf(i);
            const isHidden = orderIndex < step;
            const { w, h } = sizes[i];
            sizeValues.push(isHidden ? '0px 0px' : `${w}px ${h}px`);
        }

        keyframes += `
            ${percent}% {
                mask-size: ${sizeValues.join(',')};
            }
        `;
    }

    return `
        ::view-transition-new(root) {
            animation: none !important;
            z-index: 1;
        }

        ::view-transition-old(root) {
            z-index: 2;
            mask-image: ${allImages};
            mask-position: ${maskPositionsStr};
            mask-repeat: no-repeat;
            animation: tile-reveal ${REVEAL_DURATION}ms linear forwards !important;
            -webkit-mask-image: ${allImages};
            -webkit-mask-position: ${maskPositionsStr};
            -webkit-mask-repeat: no-repeat;
        }

        @keyframes tile-reveal {
            ${keyframes}
        }
    `;
}

// Maximum time before forcing cleanup (animation duration + buffer)
const SAFETY_TIMEOUT = LINE_DRAW_DURATION + REVEAL_DURATION + LINE_DRAW_DURATION + 2000;

class ThemeTransitionManager {
    private container: HTMLDivElement | null = null;
    private styleEl: HTMLStyleElement | null = null;
    private isAnimating = false;
    private abortController: AbortController | null = null;
    private safetyTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private themeChanged = false;
    private clickPosition: ClickPosition | null = null;

    private prefersReducedMotion(): boolean {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    private createGridOverlay(colors: { start: string, end: string }): {
        container: HTMLDivElement;
        hLines: HTMLDivElement[];
        vLines: HTMLDivElement[];
    } {
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';

        const hLines: HTMLDivElement[] = [];
        const vLines: HTMLDivElement[] = [];

        // Use exact pixel positions matching tile geometry calculations
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const transition = `
            width ${LINE_DRAW_DURATION}ms ease-in-out,
            height ${LINE_DRAW_DURATION}ms ease-in-out,
            background-color ${REVEAL_DURATION}ms ease-in-out
        `;

        // Horizontal lines at 25%, 50%, 75% of viewport height (rounded to integers)
        for (let i = 1; i < GRID_ROWS; i++) {
            const yPos = Math.round((i / GRID_ROWS) * vh);
            const line = document.createElement('div');
            line.style.cssText = `
                position:absolute;top:${yPos}px;left:50%;
                transform:translateX(-50%);width:0;height:1px;
                background:${colors.start};
                transition:${transition};
            `;
            hLines.push(line);
            container.appendChild(line);
        }

        // Vertical lines at 25%, 50%, 75% of viewport width (rounded to integers)
        for (let i = 1; i < GRID_COLS; i++) {
            const xPos = Math.round((i / GRID_COLS) * vw);
            const line = document.createElement('div');
            line.style.cssText = `
                position:absolute;left:${xPos}px;top:50%;
                transform:translateY(-50%);width:1px;height:0;
                background:${colors.start};
                transition:${transition};
            `;
            vLines.push(line);
            container.appendChild(line);
        }

        return { container, hLines, vLines };
    }

    /**
     * Setup event listeners for edge cases that should abort the animation
     */
    private setupAbortListeners(): void {
        this.abortController = new AbortController();
        const { signal } = this.abortController;

        // Abort on resize/orientation change (viewport dimensions changed)
        window.addEventListener('resize', this.handleAbort, { signal });

        // Abort if page becomes hidden (user switched tabs/apps)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.handleAbort();
        }, { signal });
    }

    /**
     * Handle abort: ensure theme is applied and cleanup happens
     */
    private handleAbort = (): void => {
        // Only abort once
        if (!this.isAnimating) return;
        this.cleanup();
    };

    /**
     * Start safety timeout that forces cleanup if animation gets stuck
     */
    private startSafetyTimeout(onThemeChange: () => void): void {
        this.safetyTimeoutId = setTimeout(() => {
            if (this.isAnimating) {
                console.warn('[ThemeTransition] Safety timeout triggered, forcing cleanup');
                // Ensure theme is changed if it hasn't been
                if (!this.themeChanged) {
                    try {
                        onThemeChange();
                        this.themeChanged = true;
                    } catch {
                        // Theme change failed, but we still need to cleanup
                    }
                }
                this.cleanup();
            }
        }, SAFETY_TIMEOUT);
    }

    private clearSafetyTimeout(): void {
        if (this.safetyTimeoutId) {
            clearTimeout(this.safetyTimeoutId);
            this.safetyTimeoutId = null;
        }
    }

    async transition(
        fromTheme: Theme,
        toTheme: Theme,
        onThemeChange: () => void,
        clickPosition?: ClickPosition
    ): Promise<void> {
        // Prevent concurrent animations
        if (this.isAnimating) return;

        // Store click position for circular reveal fallback
        this.clickPosition = clickPosition || {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        // Reduced motion preference - use gentle fade (no movement, just opacity)
        if (this.prefersReducedMotion()) {
            await this.runFadeTransition(onThemeChange);
            return;
        }

        // No View Transitions support - use fade transition
        if (!supportsViewTransitions()) {
            await this.runFadeTransition(onThemeChange);
            return;
        }

        this.isAnimating = true;
        this.themeChanged = false;

        // Setup abort handlers and safety timeout
        this.setupAbortListeners();
        this.startSafetyTimeout(onThemeChange);

        try {
            await this.runAnimation(fromTheme, onThemeChange);
        } catch (error) {
            // Tile-flip failed - try circular reveal as fallback
            console.warn('[ThemeTransition] Tile animation failed, trying circular reveal:', error);
            if (!this.themeChanged) {
                try {
                    this.cleanup(); // Clean up tile animation artifacts first
                    await this.runCircularReveal(onThemeChange);
                } catch (circularError) {
                    // Circular reveal also failed - try fade transition
                    console.warn('[ThemeTransition] Circular reveal failed, trying fade:', circularError);
                    if (!this.themeChanged) {
                        try {
                            await this.runFadeTransition(onThemeChange);
                        } catch (fadeError) {
                            // Everything failed - last resort instant change
                            console.warn('[ThemeTransition] All transitions failed:', fadeError);
                            if (!this.themeChanged) {
                                onThemeChange();
                                this.themeChanged = true;
                            }
                        }
                    }
                }
            }
        } finally {
            // Always cleanup, no matter what happened
            this.cleanup();
        }
    }

    private async runAnimation(fromTheme: Theme, onThemeChange: () => void): Promise<void> {
        const colors = LINE_COLORS[fromTheme];

        const { container, hLines, vLines } = this.createGridOverlay(colors);
        this.container = container;
        document.body.appendChild(container);
        void container.offsetHeight;

        // Check if aborted before continuing
        if (!this.isAnimating) return;

        // PHASE 1: Draw lines
        requestAnimationFrame(() => {
            hLines.forEach(l => l.style.width = '100%');
            vLines.forEach(l => l.style.height = '100%');
        });

        await this.wait(LINE_DRAW_DURATION);
        if (!this.isAnimating) return;

        // PHASE 2: View Transition or Fallback
        if (supportsViewTransitions()) {
            await this.runViewTransition(onThemeChange, hLines, vLines, colors);
        } else {
            await this.fallback(onThemeChange, hLines, vLines, colors.end);
        }
    }

    private async runViewTransition(
        onThemeChange: () => void,
        hLines: HTMLDivElement[],
        vLines: HTMLDivElement[],
        colors: { start: string; end: string }
    ): Promise<void> {
        this.styleEl = document.createElement('style');
        this.styleEl.textContent = generateViewTransitionCSS();
        document.head.appendChild(this.styleEl);

        let transition: ViewTransition;
        try {
            transition = document.startViewTransition!(() => {
                onThemeChange();
                this.themeChanged = true;
            });
        } catch (error) {
            // startViewTransition can throw if called during another transition
            console.warn('[ThemeTransition] startViewTransition failed:', error);
            if (!this.themeChanged) {
                onThemeChange();
                this.themeChanged = true;
            }
            return;
        }

        try {
            await transition.ready;
        } catch {
            // transition.ready can reject if the transition is skipped
            // Theme should already be changed by the callback
            return;
        }

        if (!this.isAnimating) return;

        // Change line colors during reveal
        requestAnimationFrame(() => {
            hLines.forEach(l => l.style.backgroundColor = colors.end);
            vLines.forEach(l => l.style.backgroundColor = colors.end);
        });

        await this.wait(REVEAL_DURATION);
        if (!this.isAnimating) return;

        // PHASE 3: Undraw lines
        requestAnimationFrame(() => {
            hLines.forEach(l => l.style.width = '0');
            vLines.forEach(l => l.style.height = '0');
        });

        await this.wait(LINE_DRAW_DURATION);

        try {
            await transition.finished;
        } catch {
            // transition.finished can reject if aborted
            // This is fine, we just need to cleanup
        }
    }

    private async fallback(
        onThemeChange: () => void,
        hLines: HTMLDivElement[],
        vLines: HTMLDivElement[],
        endColor: string
    ): Promise<void> {
        onThemeChange();
        this.themeChanged = true;

        if (!this.isAnimating) return;

        requestAnimationFrame(() => {
            hLines.forEach(l => l.style.backgroundColor = endColor);
            vLines.forEach(l => l.style.backgroundColor = endColor);
        });

        await this.wait(100);
        if (!this.isAnimating) return;

        requestAnimationFrame(() => {
            hLines.forEach(l => l.style.width = '0');
            vLines.forEach(l => l.style.height = '0');
        });

        await this.wait(LINE_DRAW_DURATION);
    }

    /**
     * Generate CSS for circular reveal animation.
     * Injected dynamically to avoid conflicts with tile animation.
     */
    private generateCircularRevealCSS(x: number, y: number, maxRadius: number): string {
        return `
            @keyframes theme-circular-reveal {
                from {
                    clip-path: circle(0px at ${x}px ${y}px);
                }
                to {
                    clip-path: circle(${maxRadius}px at ${x}px ${y}px);
                }
            }

            ::view-transition-old(root) {
                animation: none !important;
                z-index: 1;
            }

            ::view-transition-new(root) {
                animation: theme-circular-reveal ${CIRCULAR_REVEAL_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                z-index: 9999;
            }

            ::view-transition-group(root) {
                animation-duration: 0s !important;
            }
        `;
    }

    /**
     * Circular reveal animation - simpler fallback for small screens.
     * Uses clip-path circle animation expanding from click position.
     */
    private async runCircularReveal(onThemeChange: () => void): Promise<void> {
        const { x, y } = this.clickPosition || {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        // Calculate max radius to cover entire viewport from click position
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Inject CSS for the circular reveal animation
        this.styleEl = document.createElement('style');
        this.styleEl.textContent = this.generateCircularRevealCSS(x, y, maxRadius);
        document.head.appendChild(this.styleEl);

        try {
            const transition = document.startViewTransition!(() => {
                onThemeChange();
            });

            await transition.finished;
        } catch (error) {
            // If transition fails, ensure theme is still changed
            console.warn('[ThemeTransition] Circular reveal failed:', error);
            onThemeChange();
        } finally {
            // Clean up injected CSS
            if (this.styleEl) {
                this.styleEl.remove();
                this.styleEl = null;
            }
        }
    }

    /**
     * Fade transition - universal fallback that works everywhere.
     * Uses a simple overlay that fades in, theme changes, then fades out.
     * Gentle enough for reduced motion users (no movement, just opacity).
     */
    private async runFadeTransition(onThemeChange: () => void): Promise<void> {
        // Create overlay matching current theme background
        const overlay = document.createElement('div');
        const isDark = document.documentElement.classList.contains('dark');

        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 99999;
            pointer-events: none;
            background-color: ${isDark ? '#0a0a0a' : '#ffffff'};
            opacity: 0;
            transition: opacity ${FADE_DURATION}ms ease-in-out;
        `;

        document.body.appendChild(overlay);

        // Force reflow to ensure transition works
        void overlay.offsetHeight;

        // Fade in
        overlay.style.opacity = '1';
        await this.wait(FADE_DURATION);

        // Change theme while overlay is opaque
        onThemeChange();
        this.themeChanged = true;

        // Update overlay color to new theme background
        const isNowDark = document.documentElement.classList.contains('dark');
        overlay.style.backgroundColor = isNowDark ? '#0a0a0a' : '#ffffff';

        // Small delay to ensure theme has applied
        await this.wait(50);

        // Fade out
        overlay.style.opacity = '0';
        await this.wait(FADE_DURATION);

        // Cleanup
        overlay.remove();
    }

    private wait(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }

    private cleanup(): void {
        // Clear safety timeout
        this.clearSafetyTimeout();

        // Remove abort listeners
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }

        // Remove DOM elements
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        if (this.styleEl) {
            this.styleEl.remove();
            this.styleEl = null;
        }

        this.isAnimating = false;
    }
}

export const themeTransitionManager = new ThemeTransitionManager();