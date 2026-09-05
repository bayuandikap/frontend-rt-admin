import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <nav className="navbar bg-white border-bottom sticky-top">
            <div className="container-fluid px-4">

                <div className="d-flex align-items-center">
                    <span className="navbar-brand fw-bold mb-0">
                        RT Admin
                    </span>

                    <span className="text-muted small ms-2">
                        Administration System
                    </span>
                </div>

                <div className="d-flex align-items-center gap-3">

                    <span className="text-muted small d-none d-md-block">
                        Administrator
                    </span>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}