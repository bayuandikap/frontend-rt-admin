import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { login } from "../services/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete form",
                text: "Please enter your email and password.",
            });

            return;
        }

        try {
            setLoading(true);

            const data = await login(
                email.trim(),
                password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Login failed",
                text:
                    error.response?.data?.message ||
                    "Unable to login. Please check your credentials.",
            });

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-5">

            <div
                className="mx-auto"
                style={{ maxWidth: 400 }}
            >

                <div className="text-center mb-4">

                    <h2 className="mb-1">
                        RT Administration
                    </h2>

                    <p className="text-muted">
                        Sign in to manage your neighborhood.
                    </p>

                </div>

                <div className="card border-0 shadow-sm">

                    <div className="card-body p-4">

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label
                                    htmlFor="email"
                                    className="form-label"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="email"
                                    required
                                />

                            </div>

                            <div className="mb-4">

                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="current-password"
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        />

                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
}