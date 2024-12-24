import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function Register({ onSwitch }) {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

   // Register a new user in the API
   const registerUser = async (username, password) => {
      const response = await fetch(`${API_URL}/register`, {
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

   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const data = await registerUser(username, password);
         if (data.message === "User registered successfully") {
            alert("Registration successful");
            onSwitch(); // Next user will be able to login
         } else {
            alert(data.message);
         }
      } catch (error) {
         console.error("Error registering:", error);
         alert(error.message || "An error occurred during registration.");
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
            <h2>Welcome!</h2>
            <h3>Create your account.</h3>
            <form onSubmit={handleRegister}>
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
               <button type="submit">Register</button>
            </form>
            <p className="already">
               Already have an account?{" "}
               <button className="switch" onClick={onSwitch}>
                  Login here
               </button>
            </p>
         </div>
      </div>
   );
}

export default Register;
