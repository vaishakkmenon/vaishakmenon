interface WindowTitleBarProps { label?: string }

export function WindowTitleBar({ label }: WindowTitleBarProps): React.ReactElement {
    return (
        <div className="flex items-center px-4 py-2 bg-[#1a1a1a] border-b border-white/5 relative">
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            {label && (<span className="absolute left-1/2 -translate-x-1/2 text-[11px] text-white/30 font-sans tracking-wide">
                {label}
            </span>)}
        </div>
    );
}