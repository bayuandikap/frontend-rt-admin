import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";
import StatusBadge from "../../components/common/StatusBadge";

import PaymentForm from "./PaymentForm";

import {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
} from "../../services/paymentService";

import {
    formatCurrency,
    formatDate,
} from "../../utils/format";

export default function Payments() {
    const [payments, setPayments] = useState([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [page, setPage] = useState(1);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const res = await getPayments({
                page,
            });

            setPayments(res.data.data || []);

            setPagination({
                current_page:
                    res.data.meta?.current_page || 1,

                last_page:
                    res.data.meta?.last_page || 1,

                total:
                    res.data.meta?.total || 0,
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load payments."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [page]);

    async function save(data) {
        try {
            if (editing) {
                await updatePayment(
                    editing.id,
                    data
                );
            } else {
                await createPayment(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            const errors =
                err.response?.data?.errors;

            if (errors) {
                alert(
                    Object.values(errors)
                        .flat()
                        .join("\n")
                );
            } else if (
                err.response?.status === 422
            ) {
                alert(
                    err.response?.data?.message ||
                    "This payment already exists."
                );
            } else {
                alert(
                    err.response?.data?.message ||
                    "Unable to save payment."
                );
            }
        }
    }

    async function remove(id) {
        try {
            await deletePayment(id);

            if (
                payments.length === 1 &&
                page > 1
            ) {
                setPage((current) => current - 1);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to delete payment."
            );
        }
    }

    function openCreate() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(payment) {
        setEditing(payment);
        setShowForm(true);
    }

    function closeForm() {
        setEditing(null);
        setShowForm(false);
    }

    return (
        <MainLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        Payments
                    </h2>

                    <p className="text-muted mb-0">
                        Manage resident payments and
                        payment records.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openCreate}
                >
                    + New Payment
                </button>
            </div>

            {showForm && (
                <PaymentForm
                    payment={editing}
                    onSubmit={save}
                    onClose={closeForm}
                />
            )}

            {loading ? (
                <div className="card">
                    <Loading message="Loading payments..." />
                </div>
            ) : error ? (
                <ErrorAlert
                    message={error}
                    onRetry={loadData}
                />
            ) : (
                <div className="card">
                    {payments.length === 0 ? (
                        <EmptyState message="No payment records found." />
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
                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payments.map(
                                            (
                                                payment,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        payment.id
                                                    }
                                                >
                                                    <td>
                                                        {(pagination.current_page -
                                                            1) *
                                                            10 +
                                                            index +
                                                            1}
                                                    </td>

                                                    <td>
                                                        {payment.house
                                                            ? `${payment.house.house_number} (${payment.house.block || "-"})`
                                                            : "-"}
                                                    </td>

                                                    <td>
                                                        {payment.payment_type
                                                            ? payment
                                                                  .payment_type
                                                                  .name
                                                            : "-"}
                                                    </td>

                                                    <td>
                                                        {payment.month}/
                                                        {payment.year}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            payment.amount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            payment.paid_at
                                                        )}
                                                    </td>

                                                    <td>
                                                        <StatusBadge
                                                            status={
                                                                payment.status
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        {payment.notes ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        payment
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <ConfirmButton
                                                                message="Delete this payment?"
                                                                onConfirm={() =>
                                                                    remove(
                                                                        payment.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </ConfirmButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {pagination.last_page >
                                1 && (
                                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div className="text-muted">
                                        Showing page{" "}
                                        {
                                            pagination.current_page
                                        }{" "}
                                        of{" "}
                                        {
                                            pagination.last_page
                                        }{" "}
                                        ·{" "}
                                        {
                                            pagination.total
                                        }{" "}
                                        payments
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm me-2"
                                            disabled={
                                                pagination.current_page ===
                                                1
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (
                                                        current
                                                    ) =>
                                                        current -
                                                        1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            disabled={
                                                pagination.current_page ===
                                                pagination.last_page
                                            }
                                            onClick={() =>
                                                setPage(
                                                    (
                                                        current
                                                    ) =>
                                                        current +
                                                        1
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </MainLayout>
    );
}