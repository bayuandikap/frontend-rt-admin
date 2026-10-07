import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import MainLayout from "../../components/layout/MainLayout";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import EmptyState from "../../components/common/EmptyState";
import ConfirmButton from "../../components/common/ConfirmButton";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";

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

            const res = await getHouses({ search, status, page });

            setHouses(res.data.data || []);

            setPagination({
                current_page: res.data.meta?.current_page || 1,
                last_page: res.data.meta?.last_page || 1,
                total: res.data.meta?.total || res.data.data?.length || 0,
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to load houses.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [search, status, page]);

    // Reset to page 1 when filters change
    function handleSearch(value) {
        setSearch(value);
        setPage(1);
    }

    function handleStatus(value) {
        setStatus(value);
        setPage(1);
    }

    async function save(data) {
        try {
            if (editing) {
                await updateHouse(editing.id, data);
            } else {
                await createHouse(data);
            }

            setEditing(null);
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            const errors = err.response?.data?.errors;
            const message = errors
                ? Object.values(errors).flat().join("\n")
                : err.response?.data?.message || "Unable to save house.";

            Swal.fire({ icon: "error", title: "Save Failed", text: message });
        }
    }

    async function remove(id) {
        try {
            await deleteHouse(id);

            if (houses.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: err.response?.data?.message || "Unable to delete house.",
            });
        }
    }

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 gap-3">
                <div>
                    <h2 className="mb-1">Houses</h2>

                    <p className="text-muted mb-0">
                        Manage registered houses in your neighborhood.
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
                    + Add House
                </button>
            </div>

            {/* Error */}
            {error && (
                <ErrorAlert message={error} onRetry={loadData} />
            )}

            {/* Form */}
            {showForm && (
                <HouseForm
                    house={editing}
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
                                htmlFor="houseSearch"
                                className="form-label small fw-semibold"
                            >
                                Search Houses
                            </label>

                            <input
                                id="houseSearch"
                                type="text"
                                className="form-control"
                                placeholder="Search by house number or block..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label
                                htmlFor="houseStatus"
                                className="form-label small fw-semibold"
                            >
                                Status
                            </label>

                            <select
                                id="houseStatus"
                                className="form-select"
                                value={status}
                                onChange={(e) => handleStatus(e.target.value)}
                            >
                                <option value="">All statuses</option>
                                <option value="occupied">Occupied</option>
                                <option value="vacant">Vacant</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="card border-0 shadow-sm">
                {/* Card Header */}
                <div className="card-header bg-white border-bottom py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="fw-semibold">House List</div>

                            <div className="text-muted small">
                                {loading
                                    ? "Loading houses..."
                                    : `${pagination.total} house${pagination.total !== 1 ? "s" : ""} found`}
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Loading message="Loading houses..." />
                ) : houses.length === 0 ? (
                    <EmptyState message="No houses found. Try adjusting your search or filter." />
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table card-table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>House Number</th>
                                        <th>Block</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {houses.map((house, index) => (
                                        <tr key={house.id}>
                                            <td>
                                                {(pagination.current_page - 1) * 10 + index + 1}
                                            </td>

                                            <td className="fw-semibold">
                                                {house.house_number}
                                            </td>

                                            <td>{house.block || "-"}</td>

                                            <td>
                                                <StatusBadge status={house.status} />
                                            </td>

                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setEditing(house);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <ConfirmButton
                                                        message="Delete this house?"
                                                        onConfirm={() => remove(house.id)}
                                                    >
                                                        Delete
                                                    </ConfirmButton>
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
                            label="house"
                            onPage={setPage}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
