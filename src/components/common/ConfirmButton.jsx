export default function ConfirmButton({
    children = "Delete",
    message = "Are you sure?",
    className = "btn btn-danger btn-sm",
    onConfirm,
    disabled = false,
}) {
    function handleClick() {
        if (window.confirm(message)) {
            onConfirm();
        }
    }

    return (
        <button
            type="button"
            className={className}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}