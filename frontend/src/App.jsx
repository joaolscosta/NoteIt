import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Notes from "./components/Notes";

function App() {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isRegistering ? (
                            <Register
                                onSwitch={() => setIsRegistering(false)}
                            />
                        ) : (
                            <Login onSwitch={() => setIsRegistering(true)} />
                        )
                    }
                />
                <Route path="/notes" element={<Notes />} />
            </Routes>
        </Router>
    );
}

export default App;
