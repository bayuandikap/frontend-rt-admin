import { useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";

import MainLayout from "../../components/layout/MainLayout";

import { getDashboard } from "../../services/dashboardService";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        const res = await getDashboard();

        setDashboard(res.data);

    }

    if (!dashboard) {

        return (
            <MainLayout>

                Loading...

            </MainLayout>
        );

    }

    const chartOptions = {

        chart: {
            toolbar: {
                show: false
            }
        },

        xaxis: {

            categories: dashboard.chart.map(i => i.month)

        },

        stroke: {

            curve: "smooth"

        }

    };

    const chartSeries = [

        {

            name: "Income",

            data: dashboard.chart.map(i => i.income)

        },

        {

            name: "Expense",

            data: dashboard.chart.map(i => i.expense)

        }

    ];

    return (

        <MainLayout>

            <h2 className="mb-4">

                Dashboard

            </h2>

            <div className="row">

                <Card
                    title="Total Houses"
                    value={dashboard.houses.total}
                />

                <Card
                    title="Occupied"
                    value={dashboard.houses.occupied}
                />

                <Card
                    title="Residents"
                    value={dashboard.residents.total}
                />

                <Card
                    title="Unpaid Bills"
                    value={dashboard.finance.unpaid_bills}
                />

            </div>

            <div className="row mt-3">

                <Card
                    title="Income"
                    value={money(dashboard.finance.total_income)}
                />

                <Card
                    title="Expense"
                    value={money(dashboard.finance.total_expense)}
                />

                <Card
                    title="Balance"
                    value={money(dashboard.finance.balance)}
                />

            </div>

            <div className="card mt-4">

                <div className="card-header">

                    Income vs Expense

                </div>

                <div className="card-body">

                    <ReactApexChart

                        options={chartOptions}

                        series={chartSeries}

                        type="line"

                        height={350}

                    />

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-lg-6">

                    <div className="card">

                        <div className="card-header">

                            Latest Payments

                        </div>

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>House</th>

                                    <th>Type</th>

                                    <th>Amount</th>

                                </tr>

                            </thead>

                            <tbody>

                                {dashboard.latest_payments.map(item => (

                                    <tr key={item.id}>

                                        <td>

                                            {item.house.house_number}

                                        </td>

                                        <td>

                                            {item.payment_type.name}

                                        </td>

                                        <td>

                                            {money(item.amount)}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                <div className="col-lg-6">

                    <div className="card">

                        <div className="card-header">

                            Latest Expenses

                        </div>

                        <table className="table">

                            <thead>

                                <tr>

                                    <th>Title</th>

                                    <th>Date</th>

                                    <th>Amount</th>

                                </tr>

                            </thead>

                            <tbody>

                                {dashboard.latest_expenses.map(item => (

                                    <tr key={item.id}>

                                        <td>

                                            {item.title}

                                        </td>

                                        <td>

                                            {item.expense_date}

                                        </td>

                                        <td>

                                            {money(item.amount)}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

function money(value) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR"

        }

    ).format(value);

}

function Card({ title, value }) {

    return (

        <div className="col-lg-3 col-md-6 mb-3">

            <div className="card">

                <div className="card-body">

                    <div className="text-secondary">

                        {title}

                    </div>

                    <h2>

                        {value}

                    </h2>

                </div>

            </div>

        </div>

    );

}