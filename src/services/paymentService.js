import api from "./api";

export const getPayments = (params) =>
    api.get("/payments", { params });

export const createPayment = (data) =>
    api.post("/payments", data);

export const updatePayment = (id, data) =>
    api.post(`/payments/${id}?_method=PUT`, data);

export const deletePayment = (id) =>
    api.delete(`/payments/${id}`);