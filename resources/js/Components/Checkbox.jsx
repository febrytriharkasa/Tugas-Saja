export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-5 w-5 rounded border-slate-300 text-primary shadow-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ' +
                className
            }
        />
    );
}
