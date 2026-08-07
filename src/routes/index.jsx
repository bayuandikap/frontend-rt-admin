import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Houses from "../pages/Houses";
import Residents from "../pages/Residents";
import Payments from "../pages/Payments";
import Expenses from "../pages/Expenses";
import Reports from "../pages/Reports";
import ProtectedRoute from "../components/ProtectedRoute";
import HouseResidents from "../pages/HouseResidents";

export default function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/houses"
                element={
                    <ProtectedRoute>
                        <Houses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/residents"
                element={
                    <ProtectedRoute>
                        <Residents />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <Payments />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/expenses"
                element={
                    <ProtectedRoute>
                        <Expenses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/house-residents"
                element={<HouseResidents />}
            />

        </Routes>
    );
}