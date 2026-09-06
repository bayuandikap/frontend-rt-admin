import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Houses from "../pages/Houses";
import Residents from "../pages/Residents";
import HouseResidents from "../pages/HouseResidents";
import Payments from "../pages/Payments";
import Expenses from "../pages/Expenses";
import Reports from "../pages/Reports";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/houses"
                    element={<Houses />}
                />

                <Route
                    path="/residents"
                    element={<Residents />}
                />

                <Route
                    path="/house-residents"
                    element={<HouseResidents />}
                />

                <Route
                    path="/payments"
                    element={<Payments />}
                />

                <Route
                    path="/expenses"
                    element={<Expenses />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />
            </Routes>
        </BrowserRouter>
    );
}