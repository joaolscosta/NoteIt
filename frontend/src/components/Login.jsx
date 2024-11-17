import React, { useState } from "react";
import axios from "axios";

export default function Login() {
    const [form, setForm] = useState("Login"); // Change between Login and Register
    const [email, setEmail] = useState(""); // to store the email
    const [password, setPassword] = useState(""); // to store the password
    const [message, setMessage] = useState(""); // to show success or error messages

    // Changes the form between Login and Register
    function handleFormChange(event) {
        event.preventDefault();
        setForm((prevForm) => (prevForm === "Login" ? "Register" : "Login"));
    }

    // handles the form submission
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            // const url =
            //     form === "Login" ? "/api/auth/login" : "/api/auth/register";

            const url =
                form === "Login"
                    ? "/routes/userRoutes/login"
                    : "/routes/userRoutes/register";

            // contact the backend
            const response = await axios.post(url, { email, password });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "-> Error occurred. Please try again."
            );
        }
    }

    return (
        <div>
            <div className="title">{form}</div>
            <div className="container">
                <form className="form-section" onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        className="input-section"
                        type="email"
                        placeholder="Type your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <input
                        className="input-section"
                        type="password"
                        placeholder="Type your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="button-container">
                        <button className="login-button" type="submit">
                            {form}
                        </button>
                        <button
                            className="login-button"
                            onClick={handleFormChange}
                        >
                            Register/Login
                        </button>
                    </div>
                </form>
                {/* abc */}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}
