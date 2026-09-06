export function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export function formatDateLong(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function formatMonth(month) {
    const monthNumber = Number(month);

    if (
        !Number.isInteger(monthNumber) ||
        monthNumber < 1 ||
        monthNumber > 12
    ) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
    }).format(
        new Date(2000, monthNumber - 1, 1)
    );
}

export function formatStatus(status) {
    if (!status) {
        return "-";
    }

    return String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
}