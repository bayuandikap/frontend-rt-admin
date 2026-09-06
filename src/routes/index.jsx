import { lazy, Suspense } from "react";
import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import MainLayout from "../components/layout/MainLayout";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Houses = lazy(() => import("../pages/Houses"));
const Residents = lazy(() => import("../pages/Residents"));
const HouseResidents = lazy(() => import("../pages/HouseResidents"));
const Payments = lazy(() => import("../pages/Payments"));
const Expenses = lazy(() => import("../pages/Expenses"));
const Reports = lazy(() => import("../pages/Reports"));

function PageLoader() {
    return (
        <MainLayout>
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "300px" }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <div className="text-muted">
                        Loading page...
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Default */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Houses */}
                <Route
                    path="/houses"
                    element={<Houses />}
                />

                {/* Residents */}
                <Route
                    path="/residents"
                    element={<Residents />}
                />

                {/* House Residents */}
                <Route
                    path="/house-residents"
                    element={<HouseResidents />}
                />

                {/* Payments */}
                <Route
                    path="/payments"
                    element={<Payments />}
                />

                {/* Expenses */}
                <Route
                    path="/expenses"
                    element={<Expenses />}
                />

                {/* Reports */}
                <Route
                    path="/reports"
                    element={<Reports />}
                />

                {/* Unknown route */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>
        </Suspense>
    );
}