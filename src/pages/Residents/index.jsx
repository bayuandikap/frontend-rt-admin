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
    const [residentStatus, setResidentStatus] = useState("");

    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [search, residentStatus]);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const res = await getResidents({
                search,
                resident_status: residentStatus,
            });

            setResidents(res.data.data || []);
        } catch (err) {
            console.error(err);

            setError("Unable to load residents.");
        } finally {
            setLoading(false);
        }
    }

    async function save(data) {
        try {
            setError("");

            if (editing) {
                await updateResident(editing.id, data);
            } else {
                await createResident(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            setError("Unable to save resident.");
        }
    }

    async function remove(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this resident?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteResident(id);

            await loadData();
        } catch (err) {
            console.error(err);

            setError("Unable to delete resident.");
        }
    }

    function openCreateForm() {
        setEditing(null);
        setShowForm(true);
    }

    function openEditForm(resident) {
        setEditing(resident);
        setShowForm(true);
    }

    function closeForm() {
        setEditing(null);
        setShowForm(false);
    }

    return (
        <MainLayout>

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">

                <div>
                    <h2 className="mb-1">
                        Residents
                    </h2>

                    <p className="text-muted mb-0">
                        Manage registered residents in your neighborhood.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={openCreateForm}
                >
                    + Add Resident
                </button>

            </div>

            {/* Error */}
            {error && (
                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={loadData}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <ResidentForm
                    resident={editing}
                    onSubmit={save}
                    onClose={closeForm}
                />
            )}

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-8">

                            <label
                                htmlFor="residentSearch"
                                className="form-label small fw-semibold"
                            >
                                Search Residents
                            </label>

                            <input
                                id="residentSearch"
                                type="text"
                                className="form-control"
                                placeholder="Search by NIK or name..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <label
                                htmlFor="residentStatus"
                                className="form-label small fw-semibold"
                            >
                                Resident Status
                            </label>

                            <select
                                id="residentStatus"
                                className="form-select"
                                value={residentStatus}
                                onChange={(e) =>
                                    setResidentStatus(e.target.value)
                                }
                            >

                                <option value="">
                                    All statuses
                                </option>

                                <option value="permanent">
                                    Permanent
                                </option>

                                <option value="temporary">
                                    Temporary
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {/* Residents Table */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-bottom py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>
                            <div className="fw-semibold">
                                Resident List
                            </div>

                            <div className="text-muted small">
                                {loading
                                    ? "Loading residents..."
                                    : `${residents.length} resident${residents.length !== 1
                                        ? "s"
                                        : ""
                                    } found`
                                }
                            </div>
                        </div>

                    </div>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                            <tr>

                                <th className="small text-muted fw-semibold">
                                    No
                                </th>

                                <th className="small text-muted fw-semibold">
                                    NIK
                                </th>

                                <th className="small text-muted fw-semibold">
                                    Name
                                </th>

                                <th className="small text-muted fw-semibold">
                                    Phone
                                </th>

                                <th className="small text-muted fw-semibold">
                                    Email
                                </th>

                                <th className="small text-muted fw-semibold">
                                    Birth Date
                                </th>

                                <th className="small text-muted fw-semibold">
                                    Status
                                </th>

                                <th className="small text-muted fw-semibold">
                                    Marital
                                </th>

                                <th className="small text-muted fw-semibold">
                                    KTP
                                </th>

                                <th
                                    className="small text-muted fw-semibold text-end"
                                    style={{ minWidth: "150px" }}
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>

                                    <td
                                        colSpan="10"
                                        className="text-center py-5"
                                    >

                                        <div
                                            className="spinner-border spinner-border-sm text-primary me-2"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>

                                        <span className="text-muted">
                                            Loading residents...
                                        </span>

                                    </td>

                                </tr>
                            ) : residents.length === 0 ? (
                                <tr>

                                    <td
                                        colSpan="10"
                                        className="text-center py-5"
                                    >

                                        <div className="fw-semibold mb-1">
                                            No residents found
                                        </div>

                                        <div className="text-muted small">
                                            Try changing your search or
                                            filter.
                                        </div>

                                    </td>

                                </tr>
                            ) : (
                                residents.map((resident, index) => (
                                    <tr key={resident.id}>

                                        <td className="text-muted">
                                            {index + 1}
                                        </td>

                                        <td className="text-nowrap">
                                            {resident.nik}
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {resident.name}
                                            </div>
                                        </td>

                                        <td className="text-nowrap">
                                            {resident.phone || "-"}
                                        </td>

                                        <td>
                                            {resident.email || "-"}
                                        </td>

                                        <td className="text-nowrap">
                                            {resident.birth_date || "-"}
                                        </td>

                                        <td>
                                            <StatusBadge
                                                status={
                                                    resident.resident_status
                                                }
                                            />
                                        </td>

                                        <td>
                                            {resident.is_married
                                                ? "Married"
                                                : "Single"
                                            }
                                        </td>

                                        <td>
                                            {resident.ktp_photo ? (
                                                <a
                                                    href={resident.ktp_photo}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td className="text-end text-nowrap">

                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() =>
                                                    openEditForm(resident)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    remove(resident.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </MainLayout>
    );
}

function StatusBadge({ status }) {
    const normalizedStatus = status?.toLowerCase();

    let className = "bg-secondary";

    if (normalizedStatus === "permanent") {
        className = "bg-success";
    }

    if (normalizedStatus === "temporary") {
        className = "bg-warning text-dark";
    }

    return (
        <span className={`badge ${className}`}>
            {status || "Unknown"}
        </span>
    );
}