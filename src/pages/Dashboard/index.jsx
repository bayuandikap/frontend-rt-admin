import { lazy, Suspense, useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import { getDashboard } from "../../services/dashboardService";

const ApexChart = lazy(() => import("react-apexcharts"));

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

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );
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
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <div>
                        <strong>
                            Something went wrong.
                        </strong>

                        <span className="ms-3">
                            {error}
                        </span>
                    </div>

                    <button
                        className="btn btn-outline-danger btn-sm"
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

    const finance = dashboard.finance ?? {};
    const houses = dashboard.houses ?? {};
    const residents = dashboard.residents ?? {};

    const chartData = (dashboard.chart ?? []).map((item) => ({
        month: item.month,
        income: Number(item.income) || 0,
        expense: Number(item.expense) || 0,
        balance:
            Number(item.balance) ||
            (Number(item.income) || 0) -
            (Number(item.expense) || 0),
    }));

    const occupancy = occupancyRate(
        houses.occupied,
        houses.total
    );

    const balanceIsPositive =
        Number(finance.balance) >= 0;

    return (
        <MainLayout>

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        Dashboard
                    </h2>

                    <p className="text-muted mb-0">
                        Overview of your RT administration
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={loadDashboard}
                >
                    Refresh
                </button>

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
                    value={houses.total ?? 0}
                    subtitle={`${houses.occupied ?? 0} occupied`}
                />

                <Card
                    title="Occupied Houses"
                    value={houses.occupied ?? 0}
                    subtitle={`${occupancy}% occupancy`}
                />

                <Card
                    title="Vacant Houses"
                    value={houses.vacant ?? 0}
                    subtitle="Available houses"
                    valueClass={
                        houses.vacant > 0
                            ? "text-warning"
                            : "text-success"
                    }
                />

                <Card
                    title="Residents"
                    value={residents.total ?? 0}
                    subtitle={`${residents.active ?? 0} active residents`}
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
                    value={money(finance.total_income)}
                    subtitle="Recorded payments"
                    columnClass="col-lg-4 col-md-6"
                />

                <Card
                    title="Total Expenses"
                    value={money(finance.total_expense)}
                    subtitle="Recorded expenses"
                    columnClass="col-lg-4 col-md-6"
                />

                <Card
                    title="Current Balance"
                    value={money(finance.balance)}
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
                        Financial Performance
                    </div>

                    <div className="text-muted small mt-1">
                        Monthly income, expenses and balance
                    </div>

                </div>

                <div className="card-body">

                    {chartData.length > 0 ? (
                        <FinancialChart
                            data={chartData}
                        />
                    ) : (
                        <div className="text-center text-muted py-5">
                            No financial data available yet.
                        </div>
                    )}

                </div>

            </div>


            {/* Unpaid Bills */}

            <div className="card border-0 shadow-sm mt-4">

                <div className="card-body d-flex justify-content-between align-items-center">

                    <div>

                        <div className="fw-semibold">
                            Unpaid Bills
                        </div>

                        <div className="text-muted small">
                            Outstanding payment records
                        </div>

                    </div>

                    <div
                        className={
                            Number(finance.unpaid_bills) > 0
                                ? "text-danger fs-4 fw-semibold"
                                : "text-success fs-4 fw-semibold"
                        }
                    >
                        {finance.unpaid_bills ?? 0}
                    </div>

                </div>

            </div>


            {/* Latest Activity */}

            <div className="row mt-4">

                {/* Payments */}

                <div className="col-lg-6 mb-4">

                    <ActivityTable
                        title="Latest Payments"
                        headers={[
                            "House",
                            "Type",
                            "Amount",
                            "Status",
                        ]}
                        items={
                            dashboard.latest_payments ?? []
                        }
                        emptyMessage="No payments recorded yet."
                        renderRow={(item) => (
                            <tr key={item.id}>

                                <td>

                                    <div className="fw-medium">
                                        {item.house?.house_number ?? "-"}
                                    </div>

                                    {item.house?.block && (
                                        <div className="text-muted small">
                                            Block {item.house.block}
                                        </div>
                                    )}

                                </td>

                                <td>
                                    {item.payment_type?.name ?? "-"}
                                </td>

                                <td className="text-nowrap">
                                    {money(item.amount)}
                                </td>

                                <td>
                                    <PaymentStatus
                                        status={item.status}
                                    />
                                </td>

                            </tr>
                        )}
                    />

                </div>


                {/* Expenses */}

                <div className="col-lg-6 mb-4">

                    <ActivityTable
                        title="Latest Expenses"
                        headers={[
                            "Title",
                            "Date",
                            "Amount",
                        ]}
                        items={
                            dashboard.latest_expenses ?? []
                        }
                        emptyMessage="No expenses recorded yet."
                        renderRow={(item) => (
                            <tr key={item.id}>

                                <td>

                                    <div className="fw-medium">
                                        {item.title}
                                    </div>

                                    {item.description && (
                                        <div
                                            className="text-muted small text-truncate"
                                            style={{
                                                maxWidth: "180px",
                                            }}
                                        >
                                            {item.description}
                                        </div>
                                    )}

                                </td>

                                <td className="text-nowrap">
                                    {formatDate(
                                        item.expense_date
                                    )}
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


/*
|--------------------------------------------------------------------------
| ApexCharts
|--------------------------------------------------------------------------
*/

function FinancialChart({ data }) {

    const categories = data.map(
        (item) => item.month
    );

    const series = [
        {
            name: "Income",
            data: data.map(
                (item) => item.income
            ),
        },
        {
            name: "Expense",
            data: data.map(
                (item) => item.expense
            ),
        },
        {
            name: "Balance",
            data: data.map(
                (item) => item.balance
            ),
        },
    ];

    const options = {

        chart: {
            type: "line",

            toolbar: {
                show: false,
            },

            zoom: {
                enabled: false,
            },
        },

        stroke: {
            curve: "smooth",
            width: 3,
        },

        markers: {
            size: 4,

            hover: {
                size: 6,
            },
        },

        dataLabels: {
            enabled: false,
        },

        xaxis: {
            categories,

            labels: {
                style: {
                    colors: "#6c757d",
                },
            },
        },

        yaxis: {

            labels: {

                formatter: (value) =>
                    formatCompactMoney(value),

                style: {
                    colors: "#6c757d",
                },

            },

        },

        tooltip: {

            y: {

                formatter: (value) =>
                    money(value),

            },

        },

        legend: {
            position: "top",
            horizontalAlign: "center",
        },

        grid: {
            borderColor: "#e9ecef",
            strokeDashArray: 4,
        },

        colors: [
            "#0d6efd",
            "#dc3545",
            "#198754",
        ],

        responsive: [
            {
                breakpoint: 768,

                options: {
                    chart: {
                        height: 300,
                    },

                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    return (
        <Suspense
            fallback={
                <div className="text-center py-5 text-muted">
                    Loading chart...
                </div>
            }
        >

            <ApexChart
                options={options}
                series={series}
                type="line"
                height={360}
                width="100%"
            />

        </Suspense>
    );
}


/*
|--------------------------------------------------------------------------
| Cards
|--------------------------------------------------------------------------
*/

function Card({
    title,
    value,
    subtitle,
    valueClass = "",
    columnClass = "col-lg-3 col-md-6",
}) {
    return (
        <div className={`${columnClass} mb-3`}>

            <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                    <div className="text-muted small mb-2">
                        {title}
                    </div>

                    <div
                        className={`fs-4 fw-semibold ${valueClass}`}
                    >
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


/*
|--------------------------------------------------------------------------
| Activity Table
|--------------------------------------------------------------------------
*/

function ActivityTable({
    title,
    headers,
    items,
    renderRow,
    emptyMessage,
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


/*
|--------------------------------------------------------------------------
| Payment Status
|--------------------------------------------------------------------------
*/

function PaymentStatus({ status }) {

    const isPaid =
        status === "paid";

    return (
        <span
            className={`badge ${isPaid
                    ? "bg-success"
                    : "bg-danger"
                }`}
        >
            {isPaid
                ? "Paid"
                : "Unpaid"}
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Formatting
|--------------------------------------------------------------------------
*/

function money(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(
        Number(value) || 0
    );
}


function formatCompactMoney(value) {

    const number =
        Number(value) || 0;

    if (
        Math.abs(number) >=
        1000000
    ) {
        return `Rp ${(
            number / 1000000
        ).toFixed(1)} jt`;
    }

    if (
        Math.abs(number) >=
        1000
    ) {
        return `Rp ${(
            number / 1000
        ).toFixed(0)} rb`;
    }

    return `Rp ${Math.round(number)}`;
}


function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    ).format(date);
}


function occupancyRate(
    occupied,
    total
) {

    if (!total) {
        return 0;
    }

    return Math.round(
        (Number(occupied) /
            Number(total)) *
        100
    );
}