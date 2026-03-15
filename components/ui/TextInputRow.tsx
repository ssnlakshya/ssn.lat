export function TextInputRow({
    label,
    value,
    onChange,
    placeholder,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-11 font-medium text-left">
                {label}
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-[130px] px-3 py-2 bg-gray-11/5 border border-gray-11/10 rounded-lg text-slate-12 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all text-left"
            />
        </div>
    );
}