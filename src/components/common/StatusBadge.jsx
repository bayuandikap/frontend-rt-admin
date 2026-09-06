export default function StatusBadge({
    status,
}) {
    if (!status) {
        return (
            <span className="badge bg-secondary">
                -
            </span>
        );
    }

    const normalized = String(status).toLowerCase();

    let className = "badge bg-secondary";

    if (
        [
            "paid",
            "active",
            "occupied",
            "permanent",
        ].includes(normalized)
    ) {
        className = "badge bg-success";
    }

    if (
        [
            "unpaid",
            "inactive",
            "vacant",
            "contract",
        ].includes(normalized)
    ) {
        className = "badge bg-warning text-dark";
    }

    return (
        <span className={className}>
            {String(status)
                .replaceAll("_", " ")
                .replace(/\b\w/g, (character) =>
                    character.toUpperCase()
                )}
        </span>
    );
}