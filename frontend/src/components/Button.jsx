export default function Button({ children, onClick, variant = "default", className = "" }) {
    return (
        <button
            className={`btn ${variant} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
