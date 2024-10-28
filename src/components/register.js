// src/components/Register.js
import React, { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // Add state for name
    const [role, setRole] = useState("student"); // Default to "student"
    const [rollNumber, setRollNumber] = useState("");
    const [department, setDepartment] = useState(""); // Adjust based on admin requirements
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Set user data based on role
            const userData = {
                uid: user.uid,
                email: user.email,
                name, // Include name in the user data
                role,
            };

            if (role === "student") {
                userData.rollNumber = rollNumber;
                userData.department = department;
            } else if (role === "admin") {
                // Additional fields for admin can be added here if necessary
            }

            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), userData);
            navigate("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name" // Placeholder for name
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Set name value
                            required
                        />
                    </div>
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
                    <div className="mb-3">
                        <select
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {role === "student" && (
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Roll Number"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {role === "admin" && (
                        <></> // Additional fields for admin can be added here if necessary
                    )}

                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    {error && <p className="text-danger mt-3 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
