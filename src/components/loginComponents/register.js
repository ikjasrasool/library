import React, { useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [batch, setBatch] = useState(""); // New state for batch
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                email: user.email,
                name,
                role: "student",  // Set the role as 'student' by default
            };

            userData.rollNumber = rollNumber;
            userData.department = department;
            userData.batch = batch; // Include batch in user data

            await setDoc(doc(db, "users", user.uid), userData);
            navigate("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100"
            style={{
                top: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #4a90e2, #50e3c2, #9013fe, #ff0080)",
                zIndex: -1,
            }}
        >
            <div
                className="card p-4"
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
                    borderRadius: "8px",
                }}
            >
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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

                    {/* Removed role selection (only student role is allowed) */}

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Roll Number"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value.toLowerCase())}
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
                    <div className="mb-3">
                        <select
                            className="form-control"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            required
                        >
                            <option value="">Select Batch</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    {error && <p className="text-danger mt-3 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
