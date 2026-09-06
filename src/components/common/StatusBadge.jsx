const STATUS_CONFIG = {
    active: {
        label: "Active",
        className: "status-badge status-badge-success",
    },

    inactive: {
        label: "Inactive",
        className: "status-badge status-badge-neutral",
    },

    permanent: {
        label: "Permanent",
        className: "status-badge status-badge-info",
    },

    contract: {
        label: "Contract",
        className: "status-badge status-badge-warning",
    },

    moved_out: {
        label: "Moved Out",
        className: "status-badge status-badge-neutral",
    },

    paid: {
        label: "Paid",
        className: "status-badge status-badge-success",
    },

    unpaid: {
        label: "Unpaid",
        className: "status-badge status-badge-danger",
    },
};

export default function StatusBadge({ status }) {
    if (!status) {
        return (
            <span className="status-badge status-badge-empty">
                -
            </span>
        );
    }

    const normalizedStatus = String(status)
        .trim()
        .toLowerCase();

    const statusConfig = {
        paid: {
            label: "Paid",
            className: "status-badge-paid",
        },

        unpaid: {
            label: "Unpaid",
            className: "status-badge-unpaid",
        },

        active: {
            label: "Active",
            className: "status-badge-active",
        },

        inactive: {
            label: "Inactive",
            className: "status-badge-inactive",
        },

        permanent: {
            label: "Permanent",
            className: "status-badge-permanent",
        },

        contract: {
            label: "Contract",
            className: "status-badge-contract",
        },

        moved_out: {
            label: "Moved Out",
            className: "status-badge-moved-out",
        },
    };

    const config = statusConfig[normalizedStatus];

    if (!config) {
        return (
            <span className="status-badge status-badge-default">
                {String(status)
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
        );
    }

    return (
        <span className={`status-badge ${config.className}`}>
            {config.label}
        </span>
    );
}