export default function ErrorAlert({
    message = "Something went wrong.",
    onRetry,
}) {
    return (
        <div
            className="alert alert-danger"
            role="alert"
        >
            <strong>
                Unable to complete the request.
            </strong>

            <div className="mt-1">
                {message}
            </div>

            {onRetry && (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-danger mt-3"
                    onClick={onRetry}
                >
                    Try Again
                </button>
            )}
        </div>
    );
}