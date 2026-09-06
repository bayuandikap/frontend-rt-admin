export default function Loading({
    message = "Loading...",
}) {
    return (
        <div
            className="text-center py-5"
            role="status"
            aria-live="polite"
        >
            <div
                className="spinner-border text-primary mb-3"
                aria-hidden="true"
            />

            <div className="text-muted">
                {message}
            </div>
        </div>
    );
}