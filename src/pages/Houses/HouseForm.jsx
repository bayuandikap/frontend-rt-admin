import { useState, useEffect } from "react";

export default function HouseForm({
    house,
    onSubmit,
    onCancel,
}) {

    const [form, setForm] = useState({
        house_number: "",
        block: "",
        status: "vacant",
    });

    useEffect(() => {

        if (house) {

            setForm(house);

        }

    }, [house]);

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    }

    function submit(e) {

        e.preventDefault();

        onSubmit(form);

    }

    return (

        <form onSubmit={submit} className="card p-3 mb-3">

            <input
                className="form-control mb-2"
                name="house_number"
                placeholder="House Number"
                value={form.house_number}
                onChange={handleChange}
            />

            <input
                className="form-control mb-2"
                name="block"
                placeholder="Block"
                value={form.block}
                onChange={handleChange}
            />

            <select
                className="form-select mb-3"
                name="status"
                value={form.status}
                onChange={handleChange}
            >

                <option value="occupied">
                    Occupied
                </option>

                <option value="vacant">
                    Vacant
                </option>

            </select>

            <button className="btn btn-primary">

                Save

            </button>

            <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={onCancel}
            >

                Cancel

            </button>

        </form>

    );

}