import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { logout as logoutApi } from "../../services/authService";

export default function Navbar({ onMenuClick }) {
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
        <nav className="navbar navbar-light bg-white border-bottom">
            <div className="container-fluid px-3 px-md-4">
                <div className="d-flex align-items-center gap-2 min-width-0">
                    {/* Mobile menu */}
                    <button
                        type="button"
                        className="btn btn-outline-secondary d-md-none"
                        onClick={onMenuClick}
                        aria-label="Open navigation menu"
                        aria-expanded="false"
                    >
                        <span
                            style={{
                                display: "block",
                                width: "18px",
                                height: "12px",
                                borderTop: "2px solid currentColor",
                                borderBottom: "2px solid currentColor",
                                position: "relative",
                            }}
                        >
                            <span
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: "3px",
                                    borderTop: "2px solid currentColor",
                                }}
                            />
                        </span>
                    </button>

                    <span className="navbar-brand fw-semibold mb-0 text-truncate">
                        RT Administration
                    </span>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-danger flex-shrink-0"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}