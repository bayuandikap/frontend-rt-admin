import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";
import Pagination from "../../components/common/Pagination";

import ExpenseForm from "./ExpenseForm";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../../services/expenseService";

import { formatCurrency, formatDate } from "../../utils/format";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);

    const [search, setSearch] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [page, setPage] = useState(1);

    const CURRENT_YEAR = new Date().getFullYear();
    const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const response = await getExpenses({ search, month: filterMonth, year: filterYear, page });

            setExpenses(response.data.data || []);

            setPagination({
                current_page: response.data.meta?.current_page || 1,
                last_page: response.data.meta?.last_page || 1,
                total: response.data.meta?.total || response.data.data?.length || 0,
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to load expenses.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [search, filterMonth, filterYear, page]);

    function handleSearch(value) {
        setSearch(value);
        setPage(1);
    }

    function handleMonth(value) {
        setFilterMonth(value);
        setPage(1);
    }

    function handleYear(value) {
        setFilterYear(value);
        setPage(1);
    }

    async function save(data) {
        try {
            if (editing) {
                await updateExpense(editing.id, data);
            } else {
                await createExpense(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            const errors = err.response?.data?.errors;
            const message = errors
                ? Object.values(errors).flat().join("\n")
                : err.response?.data?.message || "Unable to save expense.";

            Swal.fire({ icon: "error", title: "Save Failed", text: message });
        }
    }

    async function remove(id) {
        try {
            await deleteExpense(id);

            if (expenses.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: err.response?.data?.message || "Unable to delete expense.",
            });
        }
    }

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 gap-3">
                <div>
                    <h2 className="mb-1">Expenses</h2>

                    <p className="text-muted mb-0">
                        Manage RT operational expenses.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary flex-shrink-0"
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + New Expense
                </button>
            </div>

            {/* Error */}
            {error && (
                <ErrorAlert message={error} onRetry={loadData} />
            )}

            {/* Form */}
            {showForm && (
                <ExpenseForm
                    expense={editing}
                    onSubmit={save}
                    onClose={() => {
                        setEditing(null);
                        setShowForm(false);
                    }}
                />
            )}

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label
                                htmlFor="expenseSearch"
                                className="form-label small fw-semibold"
                            >
                                Search Expenses
                            </label>

                            <input
                                id="expenseSearch"
                                type="text"
                                className="form-control"
                                placeholder="Search by title or description..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label
                                htmlFor="expenseMonth"
                                className="form-label small fw-semibold"
                            >
                                Month
                            </label>

                            <select
                                id="expenseMonth"
                                className="form-select"
                                value={filterMonth}
                                onChange={(e) => handleMonth(e.target.value)}
                            >
                                <option value="">All months</option>
                                {[
                                    "January", "February", "March", "April",
                                    "May", "June", "July", "August",
                                    "September", "October", "November", "December",
                                ].map((name, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label
                                htmlFor="expenseYear"
                                className="form-label small fw-semibold"
                            >
                                Year
                            </label>

                            <select
                                id="expenseYear"
                                className="form-select"
                                value={filterYear}
                                onChange={(e) => handleYear(e.target.value)}
                            >
                                <option value="">All years</option>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="card border-0 shadow-sm">
                {/* Card Header */}
                <div className="card-header bg-white border-bottom py-3">
                    <div className="fw-semibold">Expense List</div>

                    <div className="text-muted small">
                        {loading
                            ? "Loading expenses..."
                            : `${pagination.total} expense${pagination.total !== 1 ? "s" : ""} found`}
                    </div>
                </div>

                {loading ? (
                    <Loading message="Loading expenses..." />
                ) : expenses.length === 0 ? (
                    <EmptyState message="No expense records found. Try adjusting your search." />
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table card-table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Title</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {expenses.map((expense, index) => (
                                        <tr key={expense.id}>
                                            <td>
                                                {(pagination.current_page - 1) * 10 + index + 1}
                                            </td>

                                            <td>
                                                <strong>{expense.title}</strong>
                                            </td>

                                            <td>{formatCurrency(expense.amount)}</td>

                                            <td>{formatDate(expense.expense_date)}</td>

                                            <td>{expense.description || "-"}</td>

                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setEditing(expense);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <ConfirmButton
                                                        message="Delete this expense?"
                                                        onConfirm={() => remove(expense.id)}
                                                    >
                                                        Delete
                                                    </ConfirmButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={pagination.current_page}
                            lastPage={pagination.last_page}
                            total={pagination.total}
                            label="expense"
                            onPage={setPage}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
