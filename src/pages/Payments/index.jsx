import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";

import PaymentForm from "./PaymentForm";

import {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
} from "../../services/paymentService";

import { getPaymentTypes } from "../../services/paymentTypeService";

import { formatCurrency, formatDate } from "../../utils/format";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState(null);
    const [paymentTypes, setPaymentTypes] = useState([]);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPaymentType, setFilterPaymentType] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getPaymentTypes()
            .then((res) => setPaymentTypes(res.data || []))
            .catch((err) => console.error("Failed to load payment types", err));
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const res = await getPayments({
                page,
                search,
                status: filterStatus,
                payment_type_id: filterPaymentType,
                year: filterYear,
                month: filterMonth,
            });

            setPayments(res.data.data || []);
            setSummary(res.data.summary || null);

            setPagination({
                current_page: res.data.meta?.current_page || 1,
                last_page: res.data.meta?.last_page || 1,
                total: res.data.meta?.total || 0,
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to load payments.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [page, search, filterStatus, filterPaymentType, filterYear, filterMonth]);

    function resetPage() {
        setPage(1);
    }

    async function save(data) {
        try {
            if (editing) {
                await updatePayment(editing.id, data);
            } else {
                await createPayment(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            const errors = err.response?.data?.errors;
            const message = errors
                ? Object.values(errors).flat().join("\n")
                : err.response?.data?.message || "Unable to save payment.";

            Swal.fire({ icon: "error", title: "Save Failed", text: message });
        }
    }

    async function remove(id) {
        try {
            await deletePayment(id);

            if (payments.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: err.response?.data?.message || "Unable to delete payment.",
            });
        }
    }

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 gap-3">
                <div>
                    <h2 className="mb-1">Payments</h2>

                    <p className="text-muted mb-0">
                        Manage resident payments and payment records.
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
                    + New Payment
                </button>
            </div>

            {/* Error */}
            {error && (
                <ErrorAlert message={error} onRetry={loadData} />
            )}

            {/* Form */}
            {showForm && (
                <PaymentForm
                    payment={editing}
                    onSubmit={save}
                    onClose={() => {
                        setEditing(null);
                        setShowForm(false);
                    }}
                />
            )}

            {/* Payment Summary */}
            {!loading && summary && (
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Total Bills</div>
                                <div className="fs-4 fw-bold">{summary.total_payments}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Paid</div>
                                <div className="fs-4 fw-bold text-success">{summary.paid_payments}</div>
                                <div className="text-muted small">{formatCurrency(summary.total_paid_amount)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Unpaid</div>
                                <div className="fs-4 fw-bold text-danger">{summary.unpaid_payments}</div>
                                <div className="text-muted small">{formatCurrency(summary.total_unpaid_amount)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <div className="text-muted small mb-1">Collection Rate</div>
                                <div className="fs-4 fw-bold">
                                    {summary.total_payments > 0
                                        ? Math.round((summary.paid_payments / summary.total_payments) * 100)
                                        : 0}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label
                                htmlFor="paymentSearch"
                                className="form-label small fw-semibold"
                            >
                                Search Payments
                            </label>

                            <input
                                id="paymentSearch"
                                type="text"
                                className="form-control"
                                placeholder="Search by house number..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    resetPage();
                                }}
                            />
                        </div>

                        <div className="col-md-2">
                            <label
                                htmlFor="paymentType"
                                className="form-label small fw-semibold"
                            >
                                Type
                            </label>

                            <select
                                id="paymentType"
                                className="form-select"
                                value={filterPaymentType}
                                onChange={(e) => {
                                    setFilterPaymentType(e.target.value);
                                    resetPage();
                                }}
                            >
                                <option value="">All types</option>
                                {paymentTypes.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label
                                htmlFor="paymentStatus"
                                className="form-label small fw-semibold"
                            >
                                Status
                            </label>

                            <select
                                id="paymentStatus"
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    resetPage();
                                }}
                            >
                                <option value="">All statuses</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label
                                htmlFor="paymentYear"
                                className="form-label small fw-semibold"
                            >
                                Year
                            </label>

                            <select
                                id="paymentYear"
                                className="form-select"
                                value={filterYear}
                                onChange={(e) => {
                                    setFilterYear(e.target.value);
                                    resetPage();
                                }}
                            >
                                <option value="">All years</option>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label
                                htmlFor="paymentMonth"
                                className="form-label small fw-semibold"
                            >
                                Month
                            </label>

                            <select
                                id="paymentMonth"
                                className="form-select"
                                value={filterMonth}
                                onChange={(e) => {
                                    setFilterMonth(e.target.value);
                                    resetPage();
                                }}
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
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="card border-0 shadow-sm">
                {/* Card Header */}
                <div className="card-header bg-white border-bottom py-3">
                    <div className="fw-semibold">Payment List</div>

                    <div className="text-muted small">
                        {loading
                            ? "Loading payments..."
                            : `${pagination.total} payment${pagination.total !== 1 ? "s" : ""} found`}
                    </div>
                </div>

                {loading ? (
                    <Loading message="Loading payments..." />
                ) : payments.length === 0 ? (
                    <EmptyState message="No payment records found. Try adjusting your filters." />
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table card-table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>House</th>
                                        <th>Payment Type</th>
                                        <th>Period</th>
                                        <th>Amount</th>
                                        <th>Paid Date</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {payments.map((payment, index) => (
                                        <tr key={payment.id}>
                                            <td>
                                                {(pagination.current_page - 1) * 10 + index + 1}
                                            </td>

                                            <td>
                                                {payment.house
                                                    ? `${payment.house.house_number} (${payment.house.block || "-"})`
                                                    : "-"}
                                            </td>

                                            <td>
                                                {payment.payment_type?.name || "-"}
                                            </td>

                                            <td>
                                                {payment.month}/{payment.year}
                                            </td>

                                            <td>{formatCurrency(payment.amount)}</td>

                                            <td>{formatDate(payment.paid_at)}</td>

                                            <td>
                                                <StatusBadge status={payment.status} />
                                            </td>

                                            <td>{payment.notes || "-"}</td>

                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setEditing(payment);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <ConfirmButton
                                                        message="Delete this payment?"
                                                        onConfirm={() => remove(payment.id)}
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
                            label="payment"
                            onPage={setPage}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
