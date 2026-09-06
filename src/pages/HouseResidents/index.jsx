import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";
import StatusBadge from "../../components/common/StatusBadge";

import HouseResidentForm from "./HouseResidentForm";

import {
    getHouseResidents,
    createHouseResident,
    updateHouseResident,
    deleteHouseResident,
} from "../../services/houseResidentService";

import { getHouses } from "../../services/houseService";
import { getResidents } from "../../services/residentService";

import { formatDate } from "../../utils/format";

export default function HouseResidents() {
    const [records, setRecords] = useState([]);

    const [houses, setHouses] = useState([]);

    const [residents, setResidents] = useState([]);

    const [editing, setEditing] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                houseResidentRes,
                houseRes,
                residentRes,
            ] = await Promise.all([
                getHouseResidents(),
                getHouses(),
                getResidents(),
            ]);

            setRecords(
                houseResidentRes.data.data || []
            );

            setHouses(
                houseRes.data.data || []
            );

            setResidents(
                residentRes.data.data || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load house residents."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function save(data) {
        try {
            if (editing) {
                await updateHouseResident(
                    editing.id,
                    data
                );
            } else {
                await createHouseResident(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            const errors =
                err.response?.data?.errors;

            if (errors) {
                alert(
                    Object.values(errors)
                        .flat()
                        .join("\n")
                );
            } else {
                alert(
                    err.response?.data?.message ||
                    "Unable to save house resident."
                );
            }
        }
    }

    async function moveOut(id) {
        try {
            await deleteHouseResident(id);
            await loadData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Unable to move resident out."
            );
        }
    }

    return (
        <MainLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        House Residents
                    </h2>

                    <p className="text-muted mb-0">
                        Manage resident and house
                        assignments.
                    </p>
                </div>

                <button
                    type="button"
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

            {loading ? (
                <div className="card">
                    <Loading message="Loading house residents..." />
                </div>
            ) : error ? (
                <ErrorAlert
                    message={error}
                    onRetry={loadData}
                />
            ) : (
                <div className="card">
                    {records.length === 0 ? (
                        <EmptyState message="No house resident assignments found." />
                    ) : (
                        <div className="table-responsive">
                            <table className="table card-table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>House</th>
                                        <th>Resident</th>
                                        <th>Move In</th>
                                        <th>Move Out</th>
                                        <th>Status</th>
                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {records.map(
                                        (
                                            record,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    record.id
                                                }
                                            >
                                                <td>
                                                    {index +
                                                        1}
                                                </td>

                                                <td>
                                                    {record.house
                                                        ? `${record.house.house_number} (${record.house.block || "-"})`
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {record
                                                        .resident
                                                        ?.name ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        record.start_date
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        record.end_date
                                                    )}
                                                </td>

                                                <td>
                                                    <StatusBadge
                                                        status={
                                                            record.is_active
                                                                ? "active"
                                                                : "inactive"
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => {
                                                                setEditing(
                                                                    record
                                                                );
                                                                setShowForm(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Edit
                                                        </button>

                                                        {record.is_active && (
                                                            <ConfirmButton
                                                                message="Move this resident out of the house?"
                                                                onConfirm={() =>
                                                                    moveOut(
                                                                        record.id
                                                                    )
                                                                }
                                                            >
                                                                Move Out
                                                            </ConfirmButton>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </MainLayout>
    );
}