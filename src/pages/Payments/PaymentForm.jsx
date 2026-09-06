import { useEffect, useState } from "react";

import { getHouses } from "../../services/houseService";
import { getPaymentTypes } from "../../services/paymentTypeService";

export default function PaymentForm({
    payment,
    onSubmit,
    onClose,
}) {
    const [houses, setHouses] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);

    const [houseId, setHouseId] = useState("");
    const [paymentTypeId, setPaymentTypeId] = useState("");

    const [month, setMonth] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());

    const [amount, setAmount] = useState("");

    const [paidAt, setPaidAt] = useState("");

    const [status, setStatus] = useState("unpaid");

    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDropdown();
    }, []);

    async function loadDropdown() {
        try {
            setLoading(true);

            const [housesRes, paymentTypeRes] = await Promise.all([
                getHouses(),
                getPaymentTypes(),
            ]);

            setHouses(housesRes.data.data || []);
            setPaymentTypes(paymentTypeRes.data || []);
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to load payment form data."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!payment) {
            setHouseId("");
            setPaymentTypeId("");
            setMonth("");
            setYear(new Date().getFullYear());
            setAmount("");
            setPaidAt("");
            setStatus("unpaid");
            setNotes("");

            return;
        }

        setHouseId(payment.house_id ?? "");
        setPaymentTypeId(payment.payment_type_id ?? "");
        setMonth(payment.month ?? "");
        setYear(payment.year ?? new Date().getFullYear());
        setAmount(payment.amount ?? "");
        setPaidAt(payment.paid_at ?? "");
        setStatus(payment.status ?? "unpaid");
        setNotes(payment.notes ?? "");
    }, [payment]);

    function handlePaymentTypeChange(e) {
        const selectedId = e.target.value;

        setPaymentTypeId(selectedId);

        const selectedType = paymentTypes.find(
            (type) => String(type.id) === String(selectedId)
        );

        if (selectedType && selectedType.default_amount !== undefined) {
            setAmount(selectedType.default_amount);
        }
    }

    function submit(e) {
        e.preventDefault();

        if (!houseId) {
            alert("Please select a house.");
            return;
        }

        if (!paymentTypeId) {
            alert("Please select a payment type.");
            return;
        }

        if (!month) {
            alert("Please select a month.");
            return;
        }

        if (!year || year < 2000 || year > 2100) {
            alert("Please enter a valid year.");
            return;
        }

        if (amount === "" || Number(amount) < 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        if (status === "paid" && !paidAt) {
            alert("Please enter the paid date for a paid payment.");
            return;
        }

        onSubmit({
            house_id: houseId,
            payment_type_id: paymentTypeId,
            month: Number(month),
            year: Number(year),
            amount: Number(amount),
            paid_at: paidAt || null,
            status,
            notes: notes.trim() || null,
        });
    }

    return (
        <div className="card mb-3">

            <div className="card-header">

                <strong>
                    {payment ? "Edit Payment" : "New Payment"}
                </strong>

            </div>

            <div className="card-body">

                {loading ? (

                    <div className="text-center py-3">
                        Loading form data...
                    </div>

                ) : (

                    <form onSubmit={submit}>

                        <div className="mb-3">

                            <label className="form-label">
                                House
                            </label>

                            <select
                                className="form-select"
                                value={houseId}
                                onChange={(e) =>
                                    setHouseId(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Select House
                                </option>

                                {houses.map((house) => (

                                    <option
                                        key={house.id}
                                        value={house.id}
                                    >

                                        {house.house_number}

                                        {house.block
                                            ? ` (Block ${house.block})`
                                            : ""}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Payment Type
                            </label>

                            <select
                                className="form-select"
                                value={paymentTypeId}
                                onChange={handlePaymentTypeChange}
                                required
                            >

                                <option value="">
                                    Select Type
                                </option>

                                {paymentTypes.map((type) => (

                                    <option
                                        key={type.id}
                                        value={type.id}
                                    >

                                        {type.name}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Month
                                </label>

                                <select
                                    className="form-select"
                                    value={month}
                                    onChange={(e) =>
                                        setMonth(e.target.value)
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Month
                                    </option>

                                    {Array.from(
                                        { length: 12 }
                                    ).map((_, i) => (

                                        <option
                                            key={i + 1}
                                            value={i + 1}
                                        >

                                            {new Date(
                                                2000,
                                                i,
                                                1
                                            ).toLocaleString(
                                                "en-US",
                                                {
                                                    month: "long",
                                                }
                                            )}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

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
                                        setYear(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Amount
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                value={amount}
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                required
                            />

                            <small className="text-muted">
                                Automatically filled from the selected
                                payment type. You can still adjust it
                                if necessary.
                            </small>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Status
                            </label>

                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setStatus(value);

                                    if (value === "unpaid") {
                                        setPaidAt("");
                                    }

                                }}
                            >

                                <option value="paid">
                                    Paid
                                </option>

                                <option value="unpaid">
                                    Unpaid
                                </option>

                            </select>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Paid Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={paidAt}
                                onChange={(e) =>
                                    setPaidAt(e.target.value)
                                }
                                disabled={status !== "paid"}
                            />

                            {status === "paid" ? (

                                <small className="text-muted">
                                    Enter the date when this payment
                                    was received.
                                </small>

                            ) : (

                                <small className="text-muted">
                                    Paid date is disabled for unpaid
                                    payments.
                                </small>

                            )}

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Notes
                            </label>

                            <textarea
                                rows="3"
                                className="form-control"
                                value={notes}
                                onChange={(e) =>
                                    setNotes(e.target.value)
                                }
                                placeholder="Optional notes"
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary me-2"
                        >

                            Save

                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >

                            Cancel

                        </button>

                    </form>

                )}

            </div>

        </div>
    );
}