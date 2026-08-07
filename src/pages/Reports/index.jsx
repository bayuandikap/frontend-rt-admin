import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getReport } from "../../services/reportService";

export default function Reports() {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const [report, setReport] = useState(null);

    useEffect(() => {
        loadReport();
    }, []);

    async function loadReport() {

        try {

            const res = await getReport({
                year,
                month,
            });

            setReport(res.data);

        } catch (err) {

            console.error(err);

            alert("Failed to load report.");

        }

    }

    function money(value) {

        return new Intl.NumberFormat("id-ID", {

            style: "currency",

            currency: "IDR",

        }).format(value);

    }

    if (!report) {

        return (

            <MainLayout>

                Loading...

            </MainLayout>

        );

    }

    return (

        <MainLayout>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Financial Report</h2>

                <div className="d-flex gap-2">

                    <select
                        className="form-select"
                        style={{ width: 150 }}
                        value={month}
                        onChange={(e) =>
                            setMonth(e.target.value)
                        }
                    >

                        {Array.from({ length: 12 }).map((_, i) => (

                            <option
                                key={i + 1}
                                value={i + 1}
                            >

                                {new Date(
                                    0,
                                    i
                                ).toLocaleString(
                                    "default",
                                    {
                                        month: "long",
                                    }
                                )}

                            </option>

                        ))}

                    </select>

                    <input
                        type="number"
                        className="form-control"
                        style={{ width: 120 }}
                        value={year}
                        onChange={(e) =>
                            setYear(e.target.value)
                        }
                    />

                    <button
                        className="btn btn-primary"
                        onClick={loadReport}
                    >

                        Load Report

                    </button>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="text-secondary">

                                Total Income

                            </div>

                            <h3>

                                {money(report.summary.income)}

                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="text-secondary">

                                Total Expense

                            </div>

                            <h3>

                                {money(report.summary.expense)}

                            </h3>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card">

                        <div className="card-body">

                            <div className="text-secondary">

                                Balance

                            </div>

                            <h3>

                                {money(report.summary.balance)}

                            </h3>

                        </div>

                    </div>

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header">

                    <strong>

                        Monthly Summary ({report.year})

                    </strong>

                </div>

                <div className="table-responsive">

                    <table className="table card-table">

                        <thead>

                            <tr>

                                <th>Month</th>

                                <th>Income</th>

                                <th>Expense</th>

                                <th>Balance</th>

                            </tr>

                        </thead>

                        <tbody>

                            {report.months.map((item) => (

                                <tr key={item.month}>

                                    <td>

                                        {item.month_name}

                                    </td>

                                    <td>

                                        {money(item.income)}

                                    </td>

                                    <td>

                                        {money(item.expense)}

                                    </td>

                                    <td>

                                        {money(item.balance)}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <div className="card mb-4">

                <div className="card-header">

                    <strong>

                        Payment Details ({report.selected_month}/{report.year})

                    </strong>

                </div>

                <div className="table-responsive">

                    <table className="table card-table table-hover">

                        <thead>

                            <tr>

                                <th>House</th>

                                <th>Block</th>

                                <th>Payment Type</th>

                                <th>Amount</th>

                                <th>Status</th>

                                <th>Paid Date</th>

                            </tr>

                        </thead>

                        <tbody>

                            {report.payment_details.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center"
                                    >

                                        No payment data

                                    </td>

                                </tr>

                            )}

                            {report.payment_details.map((payment) => (

                                <tr key={payment.id}>

                                    <td>

                                        {payment.house}

                                    </td>

                                    <td>

                                        {payment.block}

                                    </td>

                                    <td>

                                        {payment.payment_type}

                                    </td>

                                    <td>

                                        {money(payment.amount)}

                                    </td>

                                    <td>

                                        {payment.status === "paid" ? (

                                            <span className="badge bg-green">

                                                Paid

                                            </span>

                                        ) : (

                                            <span className="badge bg-red">

                                                Unpaid

                                            </span>

                                        )}

                                    </td>

                                    <td>

                                        {payment.paid_at ?? "-"}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <div className="card">

                <div className="card-header">

                    <strong>

                        Expense Details ({report.selected_month}/{report.year})

                    </strong>

                </div>

                <div className="table-responsive">

                    <table className="table card-table table-hover">

                        <thead>

                            <tr>

                                <th>Title</th>

                                <th>Amount</th>

                                <th>Date</th>

                                <th>Description</th>

                            </tr>

                        </thead>

                        <tbody>

                            {report.expense_details.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >

                                        No expense data

                                    </td>

                                </tr>

                            )}

                            {report.expense_details.map((expense) => (

                                <tr key={expense.id}>

                                    <td>

                                        {expense.title}

                                    </td>

                                    <td>

                                        {money(expense.amount)}

                                    </td>

                                    <td>

                                        {expense.expense_date}

                                    </td>

                                    <td>

                                        {expense.description || "-"}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </MainLayout>

    );

}