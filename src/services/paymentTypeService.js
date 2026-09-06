import api from "../api/axios";

export const getPaymentTypes = () =>
    api.get("/payment-types");