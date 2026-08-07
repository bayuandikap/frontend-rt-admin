import { Link } from "react-router-dom";

export default function Sidebar() {

    return (

        <div
            className="bg-light border-end"
            style={{
                width: 240,
                minHeight: "100vh"
            }}
        >

            <div className="p-3">

                <h5>Menu</h5>

                <hr />

                <Link
                    className="d-block mb-2"
                    to="/dashboard"
                >
                    Dashboard
                </Link>

                <Link
                    className="d-block mb-2"
                    to="/houses"
                >
                    Houses
                </Link>

                <Link
                    className="d-block mb-2"
                    to="/residents"
                >
                    Residents
                </Link>

                <Link
                    className="d-block mb-2"
                    to="/payments"
                >
                    Payments
                </Link>

                <Link
                    className="d-block mb-2"
                    to="/expenses"
                >
                    Expenses
                </Link>

                <Link
                    className="d-block"
                    to="/reports"
                >
                    Reports
                </Link>

            </div>

        </div>

    );

}