import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function Register({ onSwitch }) {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   // Register new user
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

   // Handles form submission for registration
   const handleRegister = async (e) => {
      e.preventDefault();
      try {
         const data = await registerUser(username, password);
         if (data.message === "User registered successfully") {
            setIsDialogOpen(true);
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

         {/* Success dialog */}
         {isDialogOpen && (
            <div className="dialog-register-overlay">
               <div className="dialog-register-box">
                  <h3>Registration Successful!</h3>
                  <p>Your account has been created successfully.</p>
                  <button
                     onClick={() => {
                        setIsDialogOpen(false);
                        onSwitch(); // Switch to the login
                     }}
                  >
                     Go to Login
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default Register;
