/**
 * ThemeTransitionManager - View Transitions with Mask Tile Reveal
 *
 * Current Effect: SPIRAL IMPLOSION
 * Logic: Tiles start disappearing from the edges and 'implode' towards the center.
 * Timing: Staggered overlap ensures responsiveness.
 */

// Configuration
const GRID_COLS = 6; // Suggestion: 6x6 looks great with spiral!
const GRID_ROWS = 6;
const TOTAL_TILES = GRID_COLS * GRID_ROWS;

// Timing
const LINE_DRAW_DURATION = 800;
const REVEAL_DURATION = 2000;      // Total duration
const TILE_DURATION = 1000;        // Individual tile duration
const CIRCULAR_REVEAL_DURATION = 500;
const FADE_DURATION = 300;

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

interface TileGeometry {
    x: number;      // Top-left X
    y: number;      // Top-left Y
    w: number;      // Width
    h: number;      // Height
    cx: number;     // Center X
    cy: number;     // Center Y
}

function supportsViewTransitions(): boolean {
    return typeof document !== 'undefined' &&
        typeof document.startViewTransition === 'function';
}

const THEME_TRANSITION_START_EVENT = 'theme-transition-start';
const THEME_TRANSITION_END_EVENT = 'theme-transition-end';

function dispatchTransitionStart(): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(THEME_TRANSITION_START_EVENT));
    }
}

function dispatchTransitionEnd(): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(THEME_TRANSITION_END_EVENT));
    }
}

/**
 * Generate reveal order - SPIRAL IMPLOSION
 * Sorts tiles based on distance from the center of the grid.
 * Furthest tiles (corners) go first. Center tiles go last.
 */
function generateRevealOrder(): number[] {
    const indices = Array.from({ length: TOTAL_TILES }, (_, i) => i);

    // Calculate precise center index (even for even-numbered grids)
    const centerCol = (GRID_COLS - 1) / 2;
    const centerRow = (GRID_ROWS - 1) / 2;

    indices.sort((a, b) => {
        const rowA = Math.floor(a / GRID_COLS);
        const colA = a % GRID_COLS;
        const rowB = Math.floor(b / GRID_COLS);
        const colB = b % GRID_COLS;

        // Calculate squared distance from center
        const distA = Math.pow(colA - centerCol, 2) + Math.pow(rowA - centerRow, 2);
        const distB = Math.pow(colB - centerCol, 2) + Math.pow(rowB - centerRow, 2);

        // Descending sort: Larger distance (Edges) -> Smaller distance (Center)
        return distB - distA;
    });

    return indices;
}

/**
 * Calculate pixel-precise tile geometry.
 * Returns both Top-Left (x,y) for initial placement and Center (cx,cy) for vanishing point.
 * DYNAMIC: Works with any GRID_COLS / GRID_ROWS configuration.
 */
function calculateTileGeometry(): TileGeometry[] {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // DYNAMIC: Generate grid line centers based on configured rows/cols
    const colLineCenters: number[] = [];
    for (let i = 1; i < GRID_COLS; i++) {
        colLineCenters.push(Math.round((i / GRID_COLS) * vw));
    }

    const rowLineCenters: number[] = [];
    for (let i = 1; i < GRID_ROWS; i++) {
        rowLineCenters.push(Math.round((i / GRID_ROWS) * vh));
    }

    // Build column boundaries
    const colStarts: number[] = [];
    const colEnds: number[] = [];

    for (let col = 0; col < GRID_COLS; col++) {
        if (col === 0) {
            colStarts.push(0);
            colEnds.push(colLineCenters[0]);
        } else if (col === GRID_COLS - 1) {
            colStarts.push(colLineCenters[col - 1] + 1);
            colEnds.push(vw);
        } else {
            colStarts.push(colLineCenters[col - 1] + 1);
            colEnds.push(colLineCenters[col]);
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

    const tiles: TileGeometry[] = [];

    for (let i = 0; i < TOTAL_TILES; i++) {
        const row = Math.floor(i / GRID_COLS);
        const col = i % GRID_COLS;

        const x = colStarts[col];
        const y = rowStarts[row];
        const w = colEnds[col] - colStarts[col];
        const h = rowEnds[row] - rowStarts[row];

        const cx = x + Math.floor(w / 2);
        const cy = y + Math.floor(h / 2);

        tiles.push({ x, y, w, h, cx, cy });
    }

    return tiles;
}

/**
 * Linear Interpolation helper
 */
function lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
}

/**
 * Generate CSS with Overlapping Keyframes
 * Uses SPIRAL order + SHRINK TO CENTER animation
 */
function generateViewTransitionCSS(): string {
    const revealOrder = generateRevealOrder();
    const tiles = calculateTileGeometry();

    const maxDelay = REVEAL_DURATION - TILE_DURATION;
    const delayPerTile = maxDelay / (TOTAL_TILES - 1);

    const timePoints = new Set<number>();
    timePoints.add(0);
    timePoints.add(REVEAL_DURATION);

    const tileTimings = new Map<number, { start: number, end: number }>();

    for (let i = 0; i < TOTAL_TILES; i++) {
        const orderIndex = revealOrder.indexOf(i);
        const startTime = orderIndex * delayPerTile;
        const endTime = startTime + TILE_DURATION;

        tileTimings.set(i, { start: startTime, end: endTime });

        timePoints.add(startTime);
        timePoints.add(endTime);
    }

    const sortedTimes = Array.from(timePoints).sort((a, b) => a - b);

    let keyframes = '';

    sortedTimes.forEach(time => {
        const percent = Math.round((time / REVEAL_DURATION) * 10000) / 100;

        const sizeValues: string[] = [];
        const positionValues: string[] = [];

        for (let i = 0; i < TOTAL_TILES; i++) {
            const t = tiles[i];
            const timing = tileTimings.get(i)!;

            let progress = 0;
            if (time <= timing.start) {
                progress = 0;
            } else if (time >= timing.end) {
                progress = 1;
            } else {
                progress = (time - timing.start) / TILE_DURATION;
            }

            // Shrink BOTH dimensions (Square Shrink)
            const currentW = lerp(t.w, 0, progress);
            const currentH = lerp(t.h, 0, progress);

            // Move BOTH coordinates to center
            const currentX = lerp(t.x, t.cx, progress);
            const currentY = lerp(t.y, t.cy, progress);

            sizeValues.push(`${currentW.toFixed(1)}px ${currentH.toFixed(1)}px`);
            positionValues.push(`${currentX.toFixed(1)}px ${currentY.toFixed(1)}px`);
        }

        keyframes += `
            ${percent}% {
                mask-size: ${sizeValues.join(',')};
                mask-position: ${positionValues.join(',')};
            }
        `;
    });

    const allImages = Array(TOTAL_TILES).fill('linear-gradient(#000,#000)').join(',');
    const initialPositions = tiles.map(t => `${t.x}px ${t.y}px`).join(',');

    return `
        ::view-transition-new(root) {
            animation: none !important;
            z-index: 1;
        }

        ::view-transition-old(root) {
            z-index: 2;
            mask-image: ${allImages};
            mask-position: ${initialPositions};
            mask-repeat: no-repeat;
            animation: tile-reveal ${REVEAL_DURATION}ms linear forwards !important;
            -webkit-mask-image: ${allImages};
            -webkit-mask-position: ${initialPositions};
            -webkit-mask-repeat: no-repeat;
        }

        @keyframes tile-reveal {
            ${keyframes}
        }
    `;
}

// Maximum time before forcing cleanup
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

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const transition = `
            width ${LINE_DRAW_DURATION}ms ease-in-out,
            height ${LINE_DRAW_DURATION}ms ease-in-out,
            background-color ${REVEAL_DURATION}ms ease-in-out
        `;

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

    private setupAbortListeners(): void {
        this.abortController = new AbortController();
        const { signal } = this.abortController;

        window.addEventListener('resize', this.handleAbort, { signal });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.handleAbort();
        }, { signal });
    }

    private handleAbort = (): void => {
        if (!this.isAnimating) return;
        this.cleanup();
    };

    private startSafetyTimeout(onThemeChange: () => void): void {
        this.safetyTimeoutId = setTimeout(() => {
            if (this.isAnimating) {
                console.warn('[ThemeTransition] Safety timeout triggered, forcing cleanup');
                if (!this.themeChanged) {
                    try {
                        onThemeChange();
                        this.themeChanged = true;
                    } catch { }
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
        if (this.isAnimating) return;

        this.clickPosition = clickPosition || {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        dispatchTransitionStart();

        try {
            if (this.prefersReducedMotion()) {
                await this.runFadeTransition(onThemeChange);
                return;
            }

            if (!supportsViewTransitions()) {
                await this.runFadeTransition(onThemeChange);
                return;
            }

            this.isAnimating = true;
            this.themeChanged = false;

            this.setupAbortListeners();
            this.startSafetyTimeout(onThemeChange);

            try {
                await this.runAnimation(fromTheme, onThemeChange);
            } catch (error) {
                console.warn('[ThemeTransition] Tile animation failed, trying circular reveal:', error);
                if (!this.themeChanged) {
                    try {
                        this.cleanup();
                        await this.runCircularReveal(onThemeChange);
                    } catch (circularError) {
                        console.warn('[ThemeTransition] Circular reveal failed, trying fade:', circularError);
                        if (!this.themeChanged) {
                            try {
                                await this.runFadeTransition(onThemeChange);
                            } catch (fadeError) {
                                if (!this.themeChanged) {
                                    onThemeChange();
                                    this.themeChanged = true;
                                }
                            }
                        }
                    }
                }
            } finally {
                this.cleanup();
            }
        } finally {
            dispatchTransitionEnd();
        }
    }

    private async runAnimation(fromTheme: Theme, onThemeChange: () => void): Promise<void> {
        const colors = LINE_COLORS[fromTheme];

        const { container, hLines, vLines } = this.createGridOverlay(colors);
        this.container = container;
        document.body.appendChild(container);
        void container.offsetHeight;

        if (!this.isAnimating) return;

        // PHASE 1: Draw lines
        requestAnimationFrame(() => {
            hLines.forEach(l => l.style.width = '100%');
            vLines.forEach(l => l.style.height = '100%');
        });

        await this.wait(LINE_DRAW_DURATION);
        if (!this.isAnimating) return;

        // PHASE 2: View Transition
        await this.runViewTransition(onThemeChange, hLines, vLines, colors);
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
            return;
        }

        if (!this.isAnimating) return;

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
        } catch { }
    }

    private generateCircularRevealCSS(x: number, y: number, maxRadius: number): string {
        return `
            @keyframes theme-circular-reveal {
                from { clip-path: circle(0px at ${x}px ${y}px); }
                to { clip-path: circle(${maxRadius}px at ${x}px ${y}px); }
            }
            ::view-transition-old(root) { animation: none !important; z-index: 1; }
            ::view-transition-new(root) {
                animation: theme-circular-reveal ${CIRCULAR_REVEAL_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
                z-index: 9999;
            }
            ::view-transition-group(root) { animation-duration: 0s !important; }
        `;
    }

    private async runCircularReveal(onThemeChange: () => void): Promise<void> {
        const { x, y } = this.clickPosition || {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        this.styleEl = document.createElement('style');
        this.styleEl.textContent = this.generateCircularRevealCSS(x, y, maxRadius);
        document.head.appendChild(this.styleEl);

        try {
            const transition = document.startViewTransition!(() => {
                onThemeChange();
                this.themeChanged = true;
            });
            await transition.finished;
        } catch (error) {
            onThemeChange();
            this.themeChanged = true;
        }
    }

    private async runFadeTransition(onThemeChange: () => void): Promise<void> {
        const overlay = document.createElement('div');
        const isDark = document.documentElement.classList.contains('dark');

        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 99999; pointer-events: none;
            background-color: ${isDark ? '#0a0a0a' : '#ffffff'};
            opacity: 0; transition: opacity ${FADE_DURATION}ms ease-in-out;
        `;

        document.body.appendChild(overlay);
        void overlay.offsetHeight;

        overlay.style.opacity = '1';
        await this.wait(FADE_DURATION);

        onThemeChange();
        this.themeChanged = true;
        const isNowDark = document.documentElement.classList.contains('dark');
        overlay.style.backgroundColor = isNowDark ? '#0a0a0a' : '#ffffff';

        await this.wait(50);
        overlay.style.opacity = '0';
        await this.wait(FADE_DURATION);
        overlay.remove();
    }

    private wait(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }

    private cleanup(): void {
        this.clearSafetyTimeout();
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
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