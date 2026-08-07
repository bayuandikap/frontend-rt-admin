import { useEffect, useState } from "react";

export default function ExpenseForm({
    expense,
    onSubmit,
    onClose,
}) {

    const [title, setTitle] = useState("");

    const [amount, setAmount] = useState("");

    const [expenseDate, setExpenseDate] = useState("");

    const [description, setDescription] = useState("");

    useEffect(() => {

        if (!expense) return;

        setTitle(expense.title ?? "");

        setAmount(expense.amount ?? "");

        setExpenseDate(expense.expense_date ?? "");

        setDescription(expense.description ?? "");

    }, [expense]);

    function submit(e) {

        e.preventDefault();

        onSubmit({

            title,

            amount,

            expense_date: expenseDate,

            description,

        });

    }

    return (

        <div className="card mb-3">

            <div className="card-header">

                <strong>

                    {expense ? "Edit Expense" : "New Expense"}

                </strong>

            </div>

            <div className="card-body">

                <form onSubmit={submit}>

                    <div className="mb-3">

                        <label>Title</label>

                        <input
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label>Amount</label>

                        <input
                            type="number"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label>Expense Date</label>

                        <input
                            type="date"
                            className="form-control"
                            value={expenseDate}
                            onChange={(e) => setExpenseDate(e.target.value)}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label>Description</label>

                        <textarea
                            rows="3"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </div>

                    <button className="btn btn-primary me-2">

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