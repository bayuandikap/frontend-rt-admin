import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await login(email, password);

            // Save token
            localStorage.setItem("token", data.token);

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2 className="mb-4">RT Administration</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Email</label>

                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>

                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                >
                    Login
                </button>

            </form>
        </div>
    );
}