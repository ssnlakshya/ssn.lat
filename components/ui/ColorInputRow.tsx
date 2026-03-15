export function ColorInputRow({
    label,
    color,
    onChange,
}: {
    label: string;
    color: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-11 font-medium text-left">
                {label}
            </span>
            <div className="flex items-center border border-gray-11/10 rounded-lg overflow-hidden bg-gray-11/5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500/30 transition-all">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-9 h-9 shrink-0 cursor-pointer bg-transparent border-0 rounded-full p-0.5"
                />
                <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
                    }}
                    className="w-20 px-2 py-2 bg-transparent text-slate-12 text-xs font-mono focus:outline-none"
                />
            </div>
        </div>
    );
}