import StatusBadge from "../../components/common/StatusBadge";
import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";

import { getMonthlyFinancialReport } from "../../services/reportService";

import {
    formatCurrency,
    formatDate,
    formatMonth,
} from "../../utils/format";

export default function Reports() {
    const currentYear = new Date().getFullYear();

    const currentMonth =
        new Date().getMonth() + 1;

    const [year, setYear] =
        useState(currentYear);

    const [month, setMonth] =
        useState(currentMonth);

    const [report, setReport] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadReport() {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMonthlyFinancialReport({
                    year,
                    month,
                });

            setReport(response.data);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load financial report."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadReport();
    }, [year, month]);

    const summary = report?.summary || {
        income: 0,
        expense: 0,
        balance: 0,
    };

    const months =
        report?.months || [];

    const paymentDetails =
        report?.payment_details || [];

    const expenseDetails =
        report?.expense_details || [];

    return (
        <MainLayout>
            <div className="mb-4">
                <h2 className="mb-1">
                    Financial Reports
                </h2>

                <p className="text-muted mb-0">
                    Review income, expenses and
                    monthly financial performance.
                </p>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-end">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label">
                                Year
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                value={year}
                                min="2000"
                                max="2100"
                                onChange={(e) =>
                                    setYear(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label">
                                Month
                            </label>

                            <select
                                className="form-select"
                                value={month}
                                onChange={(e) =>
                                    setMonth(
                                        e.target.value
                                    )
                                }
                            >
                                {Array.from(
                                    {
                                        length: 12,
                                    },
                                    (_, index) =>
                                        index + 1
                                ).map(
                                    (
                                        monthNumber
                                    ) => (
                                        <option
                                            key={
                                                monthNumber
                                            }
                                            value={
                                                monthNumber
                                            }
                                        >
                                            {formatMonth(
                                                monthNumber
                                            )}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={
                                    loadReport
                                }
                            >
                                Refresh Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="card">
                    <Loading message="Loading financial report..." />
                </div>
            ) : error ? (
                <ErrorAlert
                    message={error}
                    onRetry={loadReport}
                />
            ) : (
                <>
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="text-muted mb-2">
                                        Total Income
                                    </div>

                                    <h3>
                                        {formatCurrency(
                                            summary.income
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="text-muted mb-2">
                                        Total Expense
                                    </div>

                                    <h3>
                                        {formatCurrency(
                                            summary.expense
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="text-muted mb-2">
                                        Balance
                                    </div>

                                    <h3>
                                        {formatCurrency(
                                            summary.balance
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <strong>
                                {report?.year} Monthly Summary
                            </strong>
                        </div>

                        {months.length === 0 ? (
                            <EmptyState message="No monthly financial data available." />
                        ) : (
                            <div className="table-responsive">
                                <table className="table card-table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>
                                                Month
                                            </th>
                                            <th>
                                                Income
                                            </th>
                                            <th>
                                                Expense
                                            </th>
                                            <th>
                                                Balance
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {months.map(
                                            (
                                                item
                                            ) => (
                                                <tr
                                                    key={
                                                        item.month
                                                    }
                                                    className={
                                                        Number(
                                                            item.month
                                                        ) ===
                                                            Number(
                                                                report.selected_month
                                                            )
                                                            ? "table-active"
                                                            : ""
                                                    }
                                                >
                                                    <td>
                                                        <strong>
                                                            {
                                                                item.month_name
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            item.income
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            item.expense
                                                        )}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {formatCurrency(
                                                                item.balance
                                                            )}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <strong>
                                Payment Details
                            </strong>
                        </div>

                        {paymentDetails.length ===
                            0 ? (
                            <EmptyState message="No payment data for the selected month." />
                        ) : (
                            <div className="table-responsive">
                                <table className="table card-table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>
                                                No
                                            </th>
                                            <th>
                                                House
                                            </th>
                                            <th>
                                                Block
                                            </th>
                                            <th>
                                                Payment Type
                                            </th>
                                            <th>
                                                Amount
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>
                                                Paid Date
                                            </th>
                                            <th>
                                                Notes
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paymentDetails.map(
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
                                                        {index +
                                                            1}
                                                    </td>

                                                    <td>
                                                        {payment.house ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {payment.block ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {payment.payment_type ||
                                                            "-"}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            payment.amount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            <StatusBadge status={payment.status} />
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            payment.paid_at
                                                        )}
                                                    </td>

                                                    <td>
                                                        {payment.notes ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <strong>
                                Expense Details
                            </strong>
                        </div>

                        {expenseDetails.length ===
                            0 ? (
                            <EmptyState message="No expense data for the selected month." />
                        ) : (
                            <div className="table-responsive">
                                <table className="table card-table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>
                                                No
                                            </th>
                                            <th>
                                                Title
                                            </th>
                                            <th>
                                                Amount
                                            </th>
                                            <th>
                                                Date
                                            </th>
                                            <th>
                                                Description
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {expenseDetails.map(
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
                                                        {expense.description ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </MainLayout>
    );
}