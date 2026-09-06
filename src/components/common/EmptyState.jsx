export default function EmptyState({
    message = "No data available.",
}) {
    return (
        <div className="text-center text-muted py-5">
            <div className="mb-2 fs-4">
                📭
            </div>

            <div>
                {message}
            </div>
        </div>
    );
}