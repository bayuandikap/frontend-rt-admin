export function formatCurrency(value) {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date safely without exposing raw ISO timestamps.
 *
 * Examples:
 * 2026-01-01T00:00:00.000000Z
 * → 01 Jan 2026
 *
 * 2026-01-01
 * → 01 Jan 2026
 */
export function formatDate(value) {
    if (!value) {
        return "-";
    }

    const normalizedValue =
        typeof value === "string"
            ? value.replace(/\.\d{6}Z$/, "Z")
            : value;

    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

/**
 * Long Indonesian date format.
 *
 * Example:
 * 01 Januari 2026
 */
export function formatDateLong(value) {
    if (!value) {
        return "-";
    }

    const normalizedValue =
        typeof value === "string"
            ? value.replace(/\.\d{6}Z$/, "Z")
            : value;

    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

/**
 * Format month number to Indonesian month name.
 *
 * Example:
 * 1 → Januari
 * 6 → Juni
 * 12 → Desember
 */
export function formatMonth(month) {
    const monthNumber = Number(month);

    if (
        !Number.isInteger(monthNumber) ||
        monthNumber < 1 ||
        monthNumber > 12
    ) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
        month: "long",
    }).format(
        new Date(2000, monthNumber - 1, 1)
    );
}

/**
 * Format status values for human-readable UI.
 *
 * Examples:
 * active → Active
 * moved_out → Moved Out
 * unpaid → Unpaid
 */
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

/**
 * Format a date specifically for HTML date inputs.
 *
 * Example:
 * 2026-01-01T00:00:00.000000Z
 * → 2026-01-01
 */
export function formatDateInput(value) {
    if (!value) {
        return "";
    }

    const normalizedValue =
        typeof value === "string"
            ? value.replace(/\.\d{6}Z$/, "Z")
            : value;

    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}