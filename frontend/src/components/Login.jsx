import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Login({ onSwitch }) {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   // Login the user in the API
   const loginUser = async (username, password) => {
      const response = await fetch(`${API_URL}/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.message || "Something went wrong");
      }
      return data;
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const data = await loginUser(username, password);
         if (data.message === "Login successful") {
            navigate("/main_page");
         } else {
            alert(data.message);
         }
      } catch (error) {
         console.error("Error logging in:", error);
         alert(error.message || "An error occurred during login.");
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
                  onChange={(e) => setUsername(e.target.value)}
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
      </div>
   );
}

export default Login;
