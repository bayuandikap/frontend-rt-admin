import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import ExpenseForm from "./ExpenseForm";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../../services/expenseService";

export default function Expenses() {

    const [expenses, setExpenses] = useState([]);

    const [search, setSearch] = useState("");

    const [month, setMonth] = useState("");

    const [year, setYear] = useState(new Date().getFullYear());

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    async function loadData() {

        try {

            const res = await getExpenses({
                search,
                month,
                year,
            });

            setExpenses(res.data.data);

        } catch (err) {

            console.error(err);

        }

    }

    useEffect(() => {

        loadData();

    }, [search, month, year]);

    async function save(data) {

        try {

            if (editing) {

                await updateExpense(editing.id, data);

            } else {

                await createExpense(data);

            }

            setEditing(null);

            setShowForm(false);

            loadData();

        } catch (err) {

            console.error(err);

            if (err.response?.data?.errors) {

                alert(JSON.stringify(err.response.data.errors));

            }

        }

    }

    async function remove(id) {

        if (!window.confirm("Delete this expense?"))
            return;

        try {

            await deleteExpense(id);

            loadData();

        } catch (err) {

            console.error(err);

        }

    }

    return (

        <MainLayout>

            <div className="d-flex justify-content-between mb-3">

                <h2>Expenses</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setEditing(null);

                        setShowForm(true);

                    }}
                >

                    + New Expense

                </button>

            </div>

            <div className="row mb-3">

                <div className="col-md-5">

                    <input
                        className="form-control"
                        placeholder="Search title..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />

                </div>

                <div className="col-md-3">

                    <select
                        className="form-select"
                        value={month}
                        onChange={(e)=>setMonth(e.target.value)}
                    >

                        <option value="">
                            All Month
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

                <div className="col-md-2">

                    <input
                        type="number"
                        className="form-control"
                        value={year}
                        onChange={(e)=>setYear(e.target.value)}
                    />

                </div>

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

            <div className="card">

                <div className="table-responsive">

                    <table className="table card-table table-hover">

                        <thead>

                            <tr>

                                <th>No</th>

                                <th>Title</th>

                                <th>Date</th>

                                <th>Amount</th>

                                <th>Description</th>

                                <th width="180">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {expenses.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center"
                                    >

                                        No expense data

                                    </td>

                                </tr>

                            )}

                            {expenses.map((expense,index)=>(

                                <tr key={expense.id}>

                                    <td>

                                        {index+1}

                                    </td>

                                    <td>

                                        {expense.title}

                                    </td>

                                    <td>

                                        {expense.expense_date}

                                    </td>

                                    <td>

                                        {new Intl.NumberFormat(
                                            "id-ID",
                                            {
                                                style:"currency",
                                                currency:"IDR"
                                            }
                                        ).format(expense.amount)}

                                    </td>

                                    <td>

                                        {expense.description || "-"}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={()=>{

                                                setEditing(expense);

                                                setShowForm(true);

                                            }}
                                        >

                                            Edit

                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={()=>
                                                remove(expense.id)
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