import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import MainLayout from "../../components/layout/MainLayout";
import { getDashboard } from "../../services/dashboardService";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const res = await getDashboard();

            setDashboard(res.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="text-center">
                        <div
                            className="spinner-border text-primary mb-3"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <div className="text-muted">
                            Loading dashboard...
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="alert alert-danger">
                    <strong>Something went wrong.</strong>
                    <div className="mt-1">{error}</div>

                    <button
                        className="btn btn-outline-danger btn-sm mt-3"
                        onClick={loadDashboard}
                    >
                        Try Again
                    </button>
                </div>
            </MainLayout>
        );
    }

    if (!dashboard) {
        return (
            <MainLayout>
                <div className="alert alert-warning">
                    No dashboard data available.
                </div>
            </MainLayout>
        );
    }

    const chartOptions = {
        chart: {
            toolbar: {
                show: false
            },
            fontFamily: "inherit"
        },

        colors: ["#0d6efd", "#20c997"],

        stroke: {
            curve: "smooth",
            width: 3
        },

        markers: {
            size: 0,
            hover: {
                size: 5
            }
        },

        grid: {
            borderColor: "#e9ecef"
        },

        xaxis: {
            categories: dashboard.chart.map((item) => item.month),

            labels: {
                style: {
                    colors: "#6c757d"
                }
            }
        },

        yaxis: {
            labels: {
                formatter: (value) => formatCompactMoney(value),

                style: {
                    colors: "#6c757d"
                }
            }
        },

        tooltip: {
            y: {
                formatter: (value) => money(value)
            }
        },

        legend: {
            position: "bottom",
            horizontalAlign: "center"
        },

        dataLabels: {
            enabled: false
        }
    };

    const chartSeries = [
        {
            name: "Income",
            data: dashboard.chart.map((item) => item.income)
        },
        {
            name: "Expense",
            data: dashboard.chart.map((item) => item.expense)
        }
    ];

    const balanceIsPositive = dashboard.finance.balance >= 0;

    return (
        <MainLayout>

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Overview of your RT administration
                    </p>
                </div>

            </div>

            {/* Property Overview */}
            <div className="mb-2">

                <h6 className="text-uppercase text-muted fw-semibold">
                    Property Overview
                </h6>

            </div>

            <div className="row">

                <Card
                    title="Total Houses"
                    value={dashboard.houses.total}
                    subtitle={`${dashboard.houses.occupied} occupied`}
                />

                <Card
                    title="Occupied Houses"
                    value={dashboard.houses.occupied}
                    subtitle={`${occupancyRate(
                        dashboard.houses.occupied,
                        dashboard.houses.total
                    )}% occupancy`}
                />

                <Card
                    title="Residents"
                    value={dashboard.residents.total}
                    subtitle="Registered residents"
                />

                <Card
                    title="Unpaid Bills"
                    value={dashboard.finance.unpaid_bills}
                    subtitle={
                        dashboard.finance.unpaid_bills > 0
                            ? "Requires attention"
                            : "All bills paid"
                    }
                    valueClass={
                        dashboard.finance.unpaid_bills > 0
                            ? "text-danger"
                            : "text-success"
                    }
                />

            </div>

            {/* Financial Overview */}
            <div className="mt-3 mb-2">

                <h6 className="text-uppercase text-muted fw-semibold">
                    Financial Overview
                </h6>

            </div>

            <div className="row">

                <Card
                    title="Total Income"
                    value={money(dashboard.finance.total_income)}
                    subtitle="Recorded payments"
                    columnClass="col-lg-4 col-md-6"
                />

                <Card
                    title="Total Expenses"
                    value={money(dashboard.finance.total_expense)}
                    subtitle="Recorded expenses"
                    columnClass="col-lg-4 col-md-6"
                />

                <Card
                    title="Current Balance"
                    value={money(dashboard.finance.balance)}
                    subtitle={
                        balanceIsPositive
                            ? "Positive balance"
                            : "Negative balance"
                    }
                    valueClass={
                        balanceIsPositive
                            ? "text-success"
                            : "text-danger"
                    }
                    columnClass="col-lg-4 col-md-6"
                />

            </div>

            {/* Financial Chart */}
            <div className="card border-0 shadow-sm mt-4">

                <div className="card-header bg-white border-bottom py-3">

                    <div className="fw-semibold">
                        Income vs Expense
                    </div>

                    <div className="text-muted small mt-1">
                        Monthly financial activity
                    </div>

                </div>

                <div className="card-body">

                    <ReactApexChart
                        options={chartOptions}
                        series={chartSeries}
                        type="line"
                        height={320}
                    />

                </div>

            </div>

            {/* Latest Activity */}
            <div className="row mt-4">

                <div className="col-lg-6 mb-4">

                    <ActivityTable
                        title="Latest Payments"
                        headers={[
                            "House",
                            "Type",
                            "Amount"
                        ]}
                        items={dashboard.latest_payments}
                        emptyMessage="No payments recorded yet."
                        renderRow={(item) => (
                            <tr key={item.id}>

                                <td className="fw-medium">
                                    {item.house.house_number}
                                </td>

                                <td>
                                    {item.payment_type.name}
                                </td>

                                <td className="text-nowrap">
                                    {money(item.amount)}
                                </td>

                            </tr>
                        )}
                    />

                </div>

                <div className="col-lg-6 mb-4">

                    <ActivityTable
                        title="Latest Expenses"
                        headers={[
                            "Title",
                            "Date",
                            "Amount"
                        ]}
                        items={dashboard.latest_expenses}
                        emptyMessage="No expenses recorded yet."
                        renderRow={(item) => (
                            <tr key={item.id}>

                                <td className="fw-medium">
                                    {item.title}
                                </td>

                                <td className="text-nowrap">
                                    {item.expense_date}
                                </td>

                                <td className="text-nowrap">
                                    {money(item.amount)}
                                </td>

                            </tr>
                        )}
                    />

                </div>

            </div>

        </MainLayout>
    );
}

function Card({
    title,
    value,
    subtitle,
    valueClass = ""
}) {
    return (
        <div className="col-lg-3 col-md-6 mb-3">

            <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                    <div className="text-muted small mb-2">
                        {title}
                    </div>

                    <div className={`fs-4 fw-semibold ${valueClass}`}>
                        {value}
                    </div>

                    <div className="text-muted small mt-2">
                        {subtitle}
                    </div>

                </div>

            </div>

        </div>
    );
}

function ActivityTable({
    title,
    headers,
    items,
    renderRow,
    emptyMessage
}) {
    return (
        <div className="card border-0 shadow-sm h-100">

            <div className="card-header bg-white border-bottom py-3">

                <div className="fw-semibold">
                    {title}
                </div>

            </div>

            <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">

                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="small text-muted fw-semibold"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>

                    </thead>

                    <tbody>

                        {items.length > 0 ? (
                            items.map(renderRow)
                        ) : (
                            <tr>

                                <td
                                    colSpan={headers.length}
                                    className="text-center text-muted py-4"
                                >
                                    {emptyMessage}
                                </td>

                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

function money(value) {
    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(value);
}

function formatCompactMoney(value) {
    if (Math.abs(value) >= 1000000) {
        return `Rp ${(value / 1000000).toFixed(1)} jt`;
    }

    if (Math.abs(value) >= 1000) {
        return `Rp ${(value / 1000).toFixed(0)} rb`;
    }

    return `Rp ${value}`;
}

function occupancyRate(occupied, total) {
    if (!total) {
        return 0;
    }

    return Math.round((occupied / total) * 100);
}