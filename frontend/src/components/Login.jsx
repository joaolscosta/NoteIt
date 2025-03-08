import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Login({ onSwitch, setUsername }) {
   const [username, setUsernameState] = useState("");
   const [password, setPassword] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [dialogMessage, setDialogMessage] = useState("");
   const navigate = useNavigate();

   const loginUser = async (username, password) => {
      try {
         const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
         return response.data;
      } catch (error) {
         throw new Error(error.response?.data?.message || "Something went wrong");
      }
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const data = await loginUser(username, password);
         if (data.message === "Login successful") {
            setUsername(username);
            navigate("/main_page");
         } else {
            setDialogMessage(data.message || "An error occurred during login.");
            setIsDialogOpen(true);
         }
      } catch (error) {
         console.error("Error logging in:", error);
         setDialogMessage(error.message || "An error occurred during login.");
         setIsDialogOpen(true);
      }
   };

   return (
      <div>
         <div className="login-headbar">
            <a className="headbar-title">
               Note<a className="title-complement">It</a>
            </a>
         </div>
         <div className="login-box">
            <h2>Welcome back!</h2>
            <h3>Login to your account.</h3>
            <form onSubmit={handleLogin}>
               <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsernameState(e.target.value)}
               />
               <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
               <button type="submit">Login</button>
            </form>
            <p>
               Don't have an account?{" "}
               <button className="switch" onClick={onSwitch}>
                  Register here
               </button>
            </p>
         </div>

         {/* Dialog */}
         {isDialogOpen && (
            <div className="dialog-register-overlay">
               <div className="dialog-register-box">
                  <h3>Error</h3>
                  <p>{dialogMessage}</p>
                  <button onClick={() => setIsDialogOpen(false)}>Close</button>
               </div>
            </div>
         )}
      </div>
   );
}

export default Login;
