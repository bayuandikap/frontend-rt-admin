import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { logout as logoutApi } from "../../services/authService";

export default function Navbar() {

    const navigate = useNavigate();

    async function handleLogout() {

        const result = await Swal.fire({
            icon: "question",
            title: "Logout?",
            text: "Are you sure you want to sign out?",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await logoutApi();
        } catch (error) {
            console.error(error);
        } finally {

            localStorage.removeItem("token");

            navigate("/", {
                replace: true,
            });

        }
    }

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">

            <div className="container-fluid">

                <span className="navbar-brand fw-semibold">
                    RT Administration
                </span>

                <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );
}