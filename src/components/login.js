// src/components/Login.js
import React, { useState } from "react";
import { auth, db } from "../firebase/firebase"; // Ensure db is imported from your firebase setup
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Authenticate user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Retrieve user role from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const { role } = userDoc.data();

                // Redirect based on role
                if (role === "admin") {
                    navigate("/home", { replace: true }); // Redirect to Admin Home
                } else if (role === "student") {
                    navigate("/student-home", { replace: true }); // Redirect to Student Home
                } else {
                    setError("User role not defined.");
                }
            } else {
                setError("User data not found.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    {error && <p className="text-danger mt-3 text-center">{error}</p>}
                </form>
                <p className="mt-3 text-center">
                    Don't have an account? <button className="btn btn-link" onClick={() => navigate("/register")}>Register here</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
