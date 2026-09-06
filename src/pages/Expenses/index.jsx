import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";

import ExpenseForm from "./ExpenseForm";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../../services/expenseService";

import {
    formatCurrency,
    formatDate,
} from "../../utils/format";

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const response = await getExpenses();

            setExpenses(
                response.data.data || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load expenses."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function save(data) {
        try {
            if (editing) {
                await updateExpense(
                    editing.id,
                    data
                );
            } else {
                await createExpense(data);
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
            } else {
                alert(
                    err.response?.data?.message ||
                    "Unable to save expense."
                );
            }
        }
    }

    async function remove(id) {
        try {
            await deleteExpense(id);
            await loadData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to delete expense."
            );
        }
    }

    return (
        <MainLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        Expenses
                    </h2>

                    <p className="text-muted mb-0">
                        Manage RT operational expenses.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + New Expense
                </button>
            </div>

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

            {loading ? (
                <div className="card">
                    <Loading message="Loading expenses..." />
                </div>
            ) : error ? (
                <ErrorAlert
                    message={error}
                    onRetry={loadData}
                />
            ) : (
                <div className="card">
                    {expenses.length === 0 ? (
                        <EmptyState message="No expense records found." />
                    ) : (
                        <div className="table-responsive">
                            <table className="table card-table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Title</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {expenses.map(
                                        (
                                            expense,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    expense.id
                                                }
                                            >
                                                <td>
                                                    {index +
                                                        1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            expense.title
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        expense.amount
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        expense.expense_date
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        expense.description ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => {
                                                                setEditing(
                                                                    expense
                                                                );
                                                                setShowForm(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Edit
                                                        </button>

                                                        <ConfirmButton
                                                            message="Delete this expense?"
                                                            onConfirm={() =>
                                                                remove(
                                                                    expense.id
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
                    )}
                </div>
            )}
        </MainLayout>
    );
}