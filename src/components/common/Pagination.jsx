/**
 * Reusable pagination footer used across all data pages.
 *
 * Props:
 *   currentPage  {number}   - 1-based current page
 *   lastPage     {number}   - total number of pages
 *   total        {number}   - total record count
 *   label        {string}   - noun used in the count label (e.g. "payment")
 *   onPage       {function} - called with the new page number
 */
export default function Pagination({
    currentPage,
    lastPage,
    total,
    label = "record",
    onPage,
}) {
    if (lastPage <= 1) return null;

    const plural = total === 1 ? label : `${label}s`;

    return (
        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="text-muted small">
                Page {currentPage} of {lastPage} &middot; {total} {plural}
            </div>

            <div className="d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={currentPage === 1}
                    onClick={() => onPage(currentPage - 1)}
                >
                    &laquo; Previous
                </button>

                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage === lastPage}
                    onClick={() => onPage(currentPage + 1)}
                >
                    Next &raquo;
                </button>
            </div>
        </div>
    );
}
