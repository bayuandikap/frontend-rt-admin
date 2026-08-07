import api from "./api";

export const getPaymentTypes = () =>
    api.get("/payment-types");