import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";

function App() {
   const [isRegistering, setIsRegistering] = useState(false);
   const [username, setUsername] = useState("");

   return (
      <Router>
         <Routes>
            <Route
               path="/"
               element={
                  isRegistering ? (
                     <Register onSwitch={() => setIsRegistering(false)} setUsername={setUsername} />
                  ) : (
                     <Login onSwitch={() => setIsRegistering(true)} setUsername={setUsername} />
                  )
               }
            />
            <Route path="/main_page" element={<MainPage username={username} setUsername={setUsername} />} />
         </Routes>
      </Router>
   );
}

export default App;
