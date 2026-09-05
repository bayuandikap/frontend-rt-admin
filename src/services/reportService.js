import api from "../api/axios";

export const getReport = (params = {}) =>
    api.get("/reports/monthly-financial", { params });