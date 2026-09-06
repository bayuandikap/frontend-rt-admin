import { formatDate } from "../../utils/format";
import StatusBadge from "../../components/common/StatusBadge";
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
            <div className="d-flex justify-content-between align-items-start mb-4 gap-3">
                <div>
                    <h2 className="mb-1">
                        Residents
                    </h2>

                    <p className="text-muted mb-0">
                        Manage registered residents in your neighborhood.
                    </p>
                </div>

                <button
                    className="btn btn-primary flex-shrink-0"
                    onClick={openCreateForm}
                >
                    + Add Resident
                </button>
            </div>

            {/* Error */}
            {error && (
                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center gap-3"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger flex-shrink-0"
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

            {/* Residents */}
            <div className="card border-0 shadow-sm">
                {/* Card Header */}
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
                                    } found`}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="d-none d-lg-block table-responsive">
                    <table className="table table-vcenter rt-resident-table">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>NIK</th>
                                <th>NAME</th>
                                <th>PHONE</th>
                                <th>EMAIL</th>
                                <th>BIRTH DATE</th>
                                <th>STATUS</th>
                                <th>MARITAL</th>
                                <th>KTP</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {residents.map((resident, index) => (
                                <tr key={resident.id}>
                                    <td data-label="No">
                                        {index + 1}
                                    </td>

                                    <td data-label="NIK">
                                        {resident.nik || "-"}
                                    </td>

                                    <td
                                        data-label="Name"
                                        className="fw-semibold"
                                    >
                                        {resident.name || "-"}
                                    </td>

                                    <td data-label="Phone">
                                        {resident.phone || "-"}
                                    </td>

                                    <td data-label="Email">
                                        {resident.email || "-"}
                                    </td>

                                    <td data-label="Birth Date">
                                        {formatDate(resident.birth_date)}
                                    </td>

                                    <td data-label="Status">
                                        <StatusBadge
                                            status={resident.resident_status}
                                        />
                                    </td>

                                    <td data-label="Marital">
                                        {resident.marital_status || "-"}
                                    </td>

                                    <td data-label="KTP">
                                        {resident.ktp_photo ? (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    window.open(
                                                        resident.ktp_photo,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td
                                        data-label="Actions"
                                        className="rt-resident-actions"
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() =>
                                                handleEdit(resident)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(resident.id)
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

                {/* Mobile / Tablet Cards */}
                <div className="d-lg-none">
                    {loading ? (
                        <div className="text-center py-5">
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
                        </div>
                    ) : residents.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <div className="fw-semibold mb-1">
                                No residents found
                            </div>

                            <div className="text-muted small">
                                Try changing your search or filter.
                            </div>
                        </div>
                    ) : (
                        <div className="p-3">
                            {residents.map((resident, index) => (
                                <div
                                    key={resident.id}
                                    className="border rounded-3 p-3 mb-3"
                                >
                                    {/* Resident Identity */}
                                    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                                        <div className="min-width-0">
                                            <div className="fw-semibold text-truncate">
                                                {resident.name}
                                            </div>

                                            <div className="text-muted small">
                                                NIK: {resident.nik}
                                            </div>
                                        </div>

                                        <StatusBadge
                                            status={
                                                resident.resident_status
                                            }
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="row g-3 small">
                                        <div className="col-6">
                                            <div className="text-muted mb-1">
                                                Phone
                                            </div>

                                            <div className="fw-medium text-break">
                                                {resident.phone || "-"}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="text-muted mb-1">
                                                Birth Date
                                            </div>

                                            <div className="fw-medium">
                                                {formatDate(resident.birth_date) || "-"}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="text-muted mb-1">
                                                Email
                                            </div>

                                            <div className="fw-medium text-break">
                                                {resident.email || "-"}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="text-muted mb-1">
                                                Marital Status
                                            </div>

                                            <div className="fw-medium">
                                                {resident.is_married
                                                    ? "Married"
                                                    : "Single"}
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="text-muted mb-1">
                                                KTP
                                            </div>

                                            {resident.ktp_photo ? (
                                                <a
                                                    href={resident.ktp_photo}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-secondary"
                                                >
                                                    View KTP
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    Not available
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="border-top mt-3 pt-3 d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary flex-fill"
                                            onClick={() =>
                                                openEditForm(resident)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-outline-danger flex-fill"
                                            onClick={() =>
                                                remove(resident.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div className="text-muted small mt-2">
                                        Resident #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}