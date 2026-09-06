import api from "../api/axios";

export function getResidents(params = {}) {
    return api.get("/residents", {
        params,
    });
}

export function getResident(id) {
    return api.get(`/residents/${id}`);
}

export function createResident(data) {
    return api.post("/residents", data);
}

export function updateResident(id, data) {
    return api.put(`/residents/${id}`, data);
}

export function deleteResident(id) {
    return api.delete(`/residents/${id}`);
}