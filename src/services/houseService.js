import api from "../api/axios";

export function getHouses(params = {}) {
    return api.get("/houses", {
        params,
    });
}

export function getHouse(id) {
    return api.get(`/houses/${id}`);
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