import api from "./api";

export const getReport = (params = {}) =>
    api.get("/reports/monthly-financial", { params });