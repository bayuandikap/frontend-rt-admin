import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import PaymentForm from "./PaymentForm";

import {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
} from "../../services/paymentService";

export default function Payments() {

    const [payments, setPayments] = useState([]);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    async function loadData() {

        try {

            const res = await getPayments();

            setPayments(res.data.data);

        } catch (err) {

            console.error(err);

        }

    }

    useEffect(() => {

        loadData();

    }, []);

    async function save(data) {

        try {

            if (editing) {

                await updatePayment(editing.id, data);

            } else {

                await createPayment(data);

            }

            setEditing(null);

            setShowForm(false);

            loadData();

        } catch (err) {

            console.error(err);

            if (err.response) {

                alert(JSON.stringify(err.response.data.errors));

            }

        }

    }

    async function remove(id) {

        if (!window.confirm("Delete this payment?"))
            return;

        try {

            await deletePayment(id);

            loadData();

        } catch (err) {

            console.error(err);

        }

    }

    return (

        <MainLayout>

            <div className="d-flex justify-content-between mb-3">

                <h2>Payments</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setEditing(null);

                        setShowForm(true);

                    }}
                >
                    + New Payment
                </button>

            </div>

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

            <div className="card">

                <div className="table-responsive">

                    <table className="table card-table table-hover">

                        <thead>

                            <tr>

                                <th>No</th>

                                <th>House</th>

                                <th>Payment Type</th>

                                <th>Month</th>

                                <th>Year</th>

                                <th>Amount</th>

                                <th>Paid Date</th>

                                <th>Status</th>

                                <th>Notes</th>

                                <th width="180">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {payments.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="text-center"
                                    >

                                        No payment data

                                    </td>

                                </tr>

                            )}

                            {payments.map((payment, index) => (

                                <tr key={payment.id}>

                                    <td>

                                        {index + 1}

                                    </td>

                                    <td>

                                        {payment.house
                                            ? `${payment.house.house_number} (${payment.house.block})`
                                            : "-"}

                                    </td>

                                    <td>

                                        {payment.payment_type
                                            ? payment.payment_type.name
                                            : "-"}

                                    </td>

                                    <td>

                                        {payment.month}

                                    </td>

                                    <td>

                                        {payment.year}

                                    </td>

                                    <td>

                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(payment.amount)}

                                    </td>

                                    <td>

                                        {payment.paid_at ?? "-"}

                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${payment.status === "paid"
                                                ? "bg-success"
                                                : "bg-danger"
                                                }`}
                                        >

                                            {payment.status}

                                        </span>

                                    </td>

                                    <td>

                                        {payment.notes ?? "-"}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {

                                                setEditing(payment);

                                                setShowForm(true);

                                            }}
                                        >

                                            Edit

                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                remove(payment.id)
                                            }
                                        >

                                            Delete

                                        </button>

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