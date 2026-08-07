import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import ResidentForm from "./ResidentForm";

import {
    getResidents,
    createResident,
    updateResident,
    deleteResident,
} from "../../services/residentService";

export default function Residents() {

    const [residents, setResidents] = useState([]);

    const [search, setSearch] = useState("");

    const [residentStatus, setStatus] = useState("");

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    async function loadData() {
        const res = await getResidents({
            search,
            resident_status: status,
        });

        setResidents(res.data.data);
    }

    useEffect(() => {

        loadData();

    }, [search, status]);

    async function save(data) {

        if (editing) {

            await updateResident(editing.id, data);

        } else {

            await createResident(data);

        }

        setEditing(null);

        setShowForm(false);

        loadData();

    }

    async function remove(id) {

        if (!window.confirm("Delete this resident?"))
            return;

        await deleteResident(id);

        loadData();

    }

    return (

        <MainLayout>

            <div className="d-flex justify-content-between mb-3">

                <h2>Residents</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setEditing(null);

                        setShowForm(true);

                    }}
                >
                    + Add Resident
                </button>

            </div>


            {showForm && (

                <ResidentForm
                    resident={editing}
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
                            <th>NIK</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Birth Date</th>
                            <th>Resident Status</th>
                            <th>Marital Status</th>
                            <th>KTP</th>
                            <th width="180">Action</th>

                        </tr>

                    </thead>

                    <tbody>
                        {residents.map((resident, index) => (
                            <tr key={resident.id}>
                                <td>{index + 1}</td>

                                <td>{resident.nik}</td>

                                <td>{resident.name}</td>

                                <td>{resident.phone || "-"}</td>

                                <td>{resident.email || "-"}</td>

                                <td>{resident.birth_date || "-"}</td>

                                <td>
                                    <span
                                        className={`badge ${resident.resident_status === "permanent"
                                            ? "bg-success"
                                            : "bg-warning"
                                            }`}
                                    >
                                        {resident.resident_status}
                                    </span>
                                </td>

                                <td>
                                    {resident.is_married ? "Married" : "Single"}
                                </td>

                                <td>
                                    {resident.ktp_photo ? (
                                        <a href={resident.ktp_photo} target="_blank" rel="noreferrer">
                                            View
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => {
                                            setEditing(resident);
                                            setShowForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => remove(resident.id)}
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