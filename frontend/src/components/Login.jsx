import React, { useState } from "react";

export default function Login() {
    const [form, setForm] = useState("Login");

    function handleFormChange(event) {
        event.preventDefault();
        setForm((prevForm) => (prevForm === "Login" ? "Register" : "Login"));
    }

    return (
        <div>
            <div className="title">{form}</div>
            <div className="container">
                <form className="form-section">
                    <label>Email:</label>
                    <input
                        className="input-section"
                        type="email"
                        placeholder="Type your email"
                    />
                    <label>Password:</label>
                    <input
                        className="input-section"
                        type="password"
                        placeholder="Type your password"
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
            </div>
        </div>
    );
}
