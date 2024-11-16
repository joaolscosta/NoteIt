import { useState } from "react";

function App() {
    const [form, setForm] = useState("Login");

    function handleFormChange() {
        if (form === "Login") {
            setForm("Register");
        }
        if (form === "Register") {
            setForm("Login");
        }
    }

    return (
        <>
            <h1>{form}</h1>
            <div>
                <form>
                    <input type="email" placeholder="Type your email" />
                    <input type="password" placeholder="Password" />
                    {form === "register" && (
                        <input type="password" placeholder="Confirm Password" />
                    )}
                    <button>{form}</button>
                </form>
                <button onClick={handleFormChange}>Register/Login</button>
            </div>
        </>
    );
}

export default App;
