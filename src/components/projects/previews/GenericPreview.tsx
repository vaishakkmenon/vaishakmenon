import { Code2 } from 'lucide-react';
import { PreviewWindow } from './PreviewWindow';

interface GenericPreviewProps {
    label?: string;
}

export function GenericPreview({ label = 'Preview' }: GenericPreviewProps): React.ReactElement {
    return (
        <PreviewWindow label={label}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/30">
                <Code2 className="w-8 h-8" />
                <span className="text-xs font-mono">Preview coming soon</span>
            </div>
        </PreviewWindow>
    );
}
