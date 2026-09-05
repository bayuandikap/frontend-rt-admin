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

    useEffect(() => {
        loadDropdown();
    }, []);

    async function loadDropdown() {
        const housesRes = await getHouses();

        setHouses(housesRes.data.data);

        const paymentTypeRes = await getPaymentTypes();

        setPaymentTypes(paymentTypeRes.data);
    }

    useEffect(() => {
        if (!payment) return;

        setHouseId(payment.house_id);

        setPaymentTypeId(payment.payment_type_id);

        setMonth(payment.month);

        setYear(payment.year);

        setAmount(payment.amount);

        setPaidAt(payment.paid_at ?? "");

        setStatus(payment.status);

        setNotes(payment.notes ?? "");
    }, [payment]);

    function submit(e) {
        e.preventDefault();

        onSubmit({
            house_id: houseId,
            payment_type_id: paymentTypeId,
            month,
            year,
            amount,
            paid_at: paidAt,
            status,
            notes,
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

                <form onSubmit={submit}>

                    <div className="mb-3">

                        <label>House</label>

                        <select
                            className="form-select"
                            value={houseId}
                            onChange={(e)=>setHouseId(e.target.value)}
                            required
                        >

                            <option value="">
                                Select House
                            </option>

                            {houses.map((house)=>(
                                <option
                                    key={house.id}
                                    value={house.id}
                                >
                                    {house.house_number} (Block {house.block})
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="mb-3">

                        <label>Payment Type</label>

                        <select
                            className="form-select"
                            value={paymentTypeId}
                            onChange={(e)=>setPaymentTypeId(e.target.value)}
                            required
                        >

                            <option value="">
                                Select Type
                            </option>

                            {paymentTypes.map(type=>(
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

                        <div className="col">

                            <label>Month</label>

                            <select
                                className="form-select"
                                value={month}
                                onChange={(e)=>setMonth(e.target.value)}
                            >

                                <option value="">
                                    Month
                                </option>

                                {Array.from({length:12}).map((_,i)=>(

                                    <option
                                        key={i+1}
                                        value={i+1}
                                    >
                                        {i+1}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="col">

                            <label>Year</label>

                            <input
                                type="number"
                                className="form-control"
                                value={year}
                                onChange={(e)=>setYear(e.target.value)}
                            />

                        </div>

                    </div>

                    <div className="mb-3 mt-3">

                        <label>Amount</label>

                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e)=>setAmount(e.target.value)}
                        />

                    </div>

                    <div className="mb-3">

                        <label>Paid Date</label>

                        <input
                            type="date"
                            className="form-control"
                            value={paidAt}
                            onChange={(e)=>setPaidAt(e.target.value)}
                        />

                    </div>

                    <div className="mb-3">

                        <label>Status</label>

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e)=>setStatus(e.target.value)}
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

                        <label>Notes</label>

                        <textarea
                            rows="3"
                            className="form-control"
                            value={notes}
                            onChange={(e)=>setNotes(e.target.value)}
                        />

                    </div>

                    <button
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

            </div>

        </div>
    );
}
