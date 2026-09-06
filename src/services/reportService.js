import api from "../api/axios";

export const getMonthlyFinancialReport = (params = {}) => {
    return api.get("/reports/monthly-financial", {
        params,
    });
};