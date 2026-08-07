import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import HouseForm from "./HouseForm";

import {
    getHouses,
    createHouse,
    updateHouse,
    deleteHouse,
} from "../../services/houseService";

export default function Houses() {

    const [houses, setHouses] = useState([]);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    async function loadData() {

        const res = await getHouses();

        setHouses(res.data.data);

    }

    useEffect(() => {

        loadData();

    }, []);

    async function save(data) {

        if (editing) {

            await updateHouse(editing.id, data);

        } else {

            await createHouse(data);

        }

        setEditing(null);

        setShowForm(false);

        loadData();

    }

    async function remove(id) {

        if (!confirm("Delete?")) return;

        await deleteHouse(id);

        loadData();

    }

    return (

        <MainLayout>

            <button
                className="btn btn-primary mb-3"
                onClick={() => {

                    setEditing(null);

                    setShowForm(true);

                }}
            >

                Add House

            </button>

            {showForm && (

                <HouseForm
                    house={editing}
                    onSubmit={save}
                    onCancel={() => setShowForm(false)}
                />

            )}

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>No</th>
                        <th>House</th>
                        <th>Block</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {houses.map((house, i) => (

                        <tr key={house.id}>

                            <td>{i + 1}</td>

                            <td>{house.house_number}</td>

                            <td>{house.block}</td>

                            <td>{house.status}</td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {

                                        setEditing(house);

                                        setShowForm(true);

                                    }}
                                >

                                    Edit

                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => remove(house.id)}
                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </MainLayout>

    );

}