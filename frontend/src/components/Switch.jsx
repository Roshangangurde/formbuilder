export default function Switch({ checked, onChange, className = "" }) {
    return (
        <label className={`switch ${className}`}>
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider"></span>
        </label>
    );
}
