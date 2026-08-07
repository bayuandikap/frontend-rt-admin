import api from "./api";

export function getHouses(params) {
    return api.get("/houses", { params });
}

export function createHouse(data) {
    return api.post("/houses", data);
}

export function updateHouse(id, data) {
    return api.put(`/houses/${id}`, data);
}

export function deleteHouse(id) {
    return api.delete(`/houses/${id}`);
}