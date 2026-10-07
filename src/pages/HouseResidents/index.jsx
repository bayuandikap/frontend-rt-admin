import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";

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

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [houseResidentRes, houseRes, residentRes] = await Promise.all([
                getHouseResidents({ search, is_active: filterStatus, page }),
                getHouses({ per_page: 1000 }),
                getResidents({ per_page: 1000 }),
            ]);

            setRecords(houseResidentRes.data.data || []);

            setPagination({
                current_page: houseResidentRes.data.meta?.current_page || 1,
                last_page: houseResidentRes.data.meta?.last_page || 1,
                total: houseResidentRes.data.meta?.total || houseResidentRes.data.data?.length || 0,
            });

            setHouses(houseRes.data.data || []);
            setResidents(residentRes.data.data || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to load house residents.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [search, filterStatus, page]);

    function handleSearch(value) {
        setSearch(value);
        setPage(1);
    }

    function handleStatus(value) {
        setFilterStatus(value);
        setPage(1);
    }

    async function save(data) {
        try {
            if (editing) {
                await updateHouseResident(editing.id, data);
            } else {
                await createHouseResident(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            const errors = err.response?.data?.errors;
            const message = errors
                ? Object.values(errors).flat().join("\n")
                : err.response?.data?.message || "Unable to save house resident.";

            Swal.fire({ icon: "error", title: "Save Failed", text: message });
        }
    }

    async function moveOut(id) {
        try {
            await deleteHouseResident(id);

            if (records.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Move Out Failed",
                text: err.response?.data?.message || "Unable to move resident out.",
            });
        }
    }

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 gap-3">
                <div>
                    <h2 className="mb-1">House Residents</h2>

                    <p className="text-muted mb-0">
                        Manage resident and house assignments.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary flex-shrink-0"
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + Assign Resident
                </button>
            </div>

            {/* Error */}
            {error && (
                <ErrorAlert message={error} onRetry={loadData} />
            )}

            {/* Form */}
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

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label
                                htmlFor="hrSearch"
                                className="form-label small fw-semibold"
                            >
                                Search
                            </label>

                            <input
                                id="hrSearch"
                                type="text"
                                className="form-control"
                                placeholder="Search by house number or resident name..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label
                                htmlFor="hrStatus"
                                className="form-label small fw-semibold"
                            >
                                Status
                            </label>

                            <select
                                id="hrStatus"
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => handleStatus(e.target.value)}
                            >
                                <option value="">All statuses</option>
                                <option value="1">Active</option>
                                <option value="0">Moved Out</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="card border-0 shadow-sm">
                {/* Card Header */}
                <div className="card-header bg-white border-bottom py-3">
                    <div className="fw-semibold">Assignment List</div>

                    <div className="text-muted small">
                        {loading
                            ? "Loading assignments..."
                            : `${pagination.total} assignment${pagination.total !== 1 ? "s" : ""} found`}
                    </div>
                </div>

                {loading ? (
                    <Loading message="Loading house residents..." />
                ) : records.length === 0 ? (
                    <EmptyState message="No house resident assignments found. Try adjusting your search or filter." />
                ) : (
                    <>
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
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {records.map((record, index) => (
                                        <tr key={record.id}>
                                            <td>
                                                {(pagination.current_page - 1) * 10 + index + 1}
                                            </td>

                                            <td>
                                                {record.house
                                                    ? `${record.house.house_number} (${record.house.block || "-"})`
                                                    : "-"}
                                            </td>

                                            <td>{record.resident?.name || "-"}</td>

                                            <td>{formatDate(record.start_date)}</td>

                                            <td>{formatDate(record.end_date)}</td>

                                            <td>
                                                <StatusBadge
                                                    status={
                                                        record.is_active ? "active" : "inactive"
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setEditing(record);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    {record.is_active && (
                                                        <ConfirmButton
                                                            message="Move this resident out of the house?"
                                                            onConfirm={() => moveOut(record.id)}
                                                        >
                                                            Move Out
                                                        </ConfirmButton>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={pagination.current_page}
                            lastPage={pagination.last_page}
                            total={pagination.total}
                            label="assignment"
                            onPage={setPage}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
