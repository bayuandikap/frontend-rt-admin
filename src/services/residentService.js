import api from "./api";

export const getResidents = (params) =>
    api.get("/residents", { params });

export const createResident = (data) =>
    api.post("/residents", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const updateResident = (id, data) =>
    api.post(`/residents/${id}?_method=PUT`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteResident = (id) =>
    api.delete(`/residents/${id}`);