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

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    async function loadData() {

        const res = await getHouses({
            search,
            status,
        });

        setHouses(res.data.data);

    }

    useEffect(() => {

        loadData();

    }, [search, status]);

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

        if (!window.confirm("Delete this house?"))
            return;

        await deleteHouse(id);

        loadData();

    }

    return (

        <MainLayout>

            <div className="d-flex justify-content-between mb-3">

                <h2>Houses</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setEditing(null);

                        setShowForm(true);

                    }}
                >
                    + Add House
                </button>

            </div>

            <div className="row mb-3">

                <div className="col">

                    <input
                        className="form-control"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <div className="col">

                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="">
                            All
                        </option>

                        <option value="occupied">
                            Occupied
                        </option>

                        <option value="vacant">
                            Vacant
                        </option>

                    </select>

                </div>

            </div>

            {showForm && (

                <HouseForm
                    house={editing}
                    onSubmit={save}
                    onClose={() =>
                        setShowForm(false)
                    }
                />

            )}

            <div className="card">

                <table className="table card-table table-hover">

                    <thead>

                        <tr>

                            <th>No</th>
                            <th>House Number</th>
                            <th>Block</th>
                            <th>Status</th>
                            <th width="180">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {houses.map((house, index) => (

                            <tr key={house.id}>

                                <td>{index + 1}</td>

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
                                        onClick={() =>
                                            remove(house.id)
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

        </MainLayout>

    );

}