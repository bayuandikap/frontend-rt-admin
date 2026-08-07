import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        navigate("/");

    }

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">

            <div className="container-fluid">

                <span className="navbar-brand">
                    RT Administration
                </span>

                <button
                    className="btn btn-outline-danger"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>

    );

}