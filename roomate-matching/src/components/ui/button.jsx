export function Button({ children, className = "", ...props }) {
    return (
        <button
            className={`px-4 py-2 rounded-md font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
