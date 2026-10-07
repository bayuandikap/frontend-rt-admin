import Swal from "sweetalert2";

export default function ConfirmButton({
    children = "Delete",
    message = "Are you sure?",
    className = "btn btn-outline-danger btn-sm",
    onConfirm,
    disabled = false,
}) {
    async function handleClick() {
        const result = await Swal.fire({
            icon: "warning",
            title: "Confirm",
            text: message,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d63939",
        });

        if (result.isConfirmed) {
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