import api from "./api";

export const getHouseResidents = () =>
    api.get("/house-residents");

export const createHouseResident = (data) =>
    api.post("/house-residents", data);

export const updateHouseResident = (id, data) =>
    api.put(`/house-residents/${id}`, data);

export const deleteHouseResident = (id) =>
    api.delete(`/house-residents/${id}`);