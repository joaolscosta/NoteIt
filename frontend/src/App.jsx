import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";

function App() {
   const [isRegistering, setIsRegistering] = useState(false);

   return (
      <Router>
         <Routes>
            <Route
               path="/"
               element={
                  isRegistering ? (
                     <Register onSwitch={() => setIsRegistering(false)} />
                  ) : (
                     <Login onSwitch={() => setIsRegistering(true)} />
                  )
               }
            />
            <Route path="/main_page" element={<MainPage />} />
         </Routes>
      </Router>
   );
}

export default App;
