import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import HouseResidentForm from "./HouseResidentForm";

import {
    getHouseResidents,
    createHouseResident,
    updateHouseResident,
    deleteHouseResident,
} from "../../services/houseResidentService";

import { getHouses } from "../../services/houseService";
import { getResidents } from "../../services/residentService";

export default function HouseResidents() {

    const [records, setRecords] = useState([]);

    const [houses, setHouses] = useState([]);

    const [residents, setResidents] = useState([]);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    async function loadData() {

        try {

            const [houseResidentRes, houseRes, residentRes] =
                await Promise.all([

                    getHouseResidents(),

                    getHouses(),

                    getResidents(),

                ]);

            setRecords(houseResidentRes.data.data);

            setHouses(houseRes.data.data);

            setResidents(residentRes.data.data);

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

                await updateHouseResident(editing.id, data);

            } else {

                await createHouseResident(data);

            }

            setEditing(null);

            setShowForm(false);

            loadData();

        } catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Unable to save data."

            );

        }

    }

    async function moveOut(id) {

        if (!window.confirm("Move this resident out?"))
            return;

        try {

            await deleteHouseResident(id);

            loadData();

        } catch (err) {

            console.error(err);

        }

    }

    return (

        <MainLayout>

            <div className="d-flex justify-content-between mb-3">

                <h2>House Residents</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setEditing(null);

                        setShowForm(true);

                    }}
                >

                    + Assign Resident

                </button>

            </div>

            {showForm && (

                <HouseResidentForm

                    record={editing}

                    houses={houses}

                    residents={residents}

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

                                <th>Resident</th>

                                <th>Move In</th>

                                <th>Move Out</th>

                                <th>Status</th>

                                <th width="170">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {records.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >

                                        No data

                                    </td>

                                </tr>

                            )}

                            {records.map((record, index) => (

                                <tr key={record.id}>

                                    <td>

                                        {index + 1}

                                    </td>

                                    <td>

                                        {record.house.house_number}

                                        {" "}

                                        ({record.house.block})

                                    </td>

                                    <td>

                                        {record.resident.name}

                                    </td>

                                    <td>

                                        {record.start_date}

                                    </td>

                                    <td>

                                        {record.end_date ?? "-"}

                                    </td>

                                    <td>

                                        {record.is_active ? (

                                            <span className="badge bg-green">

                                                Active

                                            </span>

                                        ) : (

                                            <span className="badge bg-secondary">

                                                Moved Out

                                            </span>

                                        )}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {

                                                setEditing(record);

                                                setShowForm(true);

                                            }}
                                        >

                                            Edit

                                        </button>

                                        {record.is_active && (

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    moveOut(record.id)
                                                }
                                            >

                                                Move Out

                                            </button>

                                        )}

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