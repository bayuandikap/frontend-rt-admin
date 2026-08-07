import api from "../api/axios";

export const getHouses = (params) =>
    api.get("/houses", { params });

export const getHouse = (id) =>
    api.get(`/houses/${id}`);

export const createHouse = (data) =>
    api.post("/houses", data);

export const updateHouse = (id, data) =>
    api.put(`/houses/${id}`, data);

export const deleteHouse = (id) =>
    api.delete(`/houses/${id}`);