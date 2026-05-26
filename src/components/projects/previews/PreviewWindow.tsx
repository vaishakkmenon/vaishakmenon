import { WindowTitleBar } from './WindowTitleBar';

interface PreviewWindowProps {
    label?: string;
    children: React.ReactNode;
    className?: string;
}

export function PreviewWindow({ label, children, className }: PreviewWindowProps): React.ReactElement {
    return (
        <div className="flex flex-col h-full rounded-xl bg-[#121212] border border-white/10 overflow-hidden">
            <WindowTitleBar label={label} />
            <div className={`flex-1 p-4 ${className ?? ''}`}>{children}</div>
        </div>
    );
}