import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function Register({ onSwitch }) {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [dialogMessage, setDialogMessage] = useState("");

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
            setDialogMessage(
               "Registration Successful! Your account has been created."
            );
         } else if (data.message === "Username already exists") {
            setDialogMessage(
               "Username already exists. Please choose a different username."
            );
         } else {
            setDialogMessage(
               data.message || "Something went wrong. Please try again."
            );
         }

         setIsDialogOpen(true); // Open the dialog with the appropriate message
      } catch (error) {
         console.error("Error registering:", error);
         setDialogMessage(
            error.message || "An error occurred during registration."
         );
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

         {/* Dialog */}
         {isDialogOpen && (
            <div className="dialog-register-overlay">
               <div className="dialog-register-box">
                  <h3>
                     {dialogMessage.includes("Successful")
                        ? "Success!"
                        : "Error"}
                  </h3>
                  <p>{dialogMessage}</p>
                  <button
                     onClick={() => {
                        setIsDialogOpen(false);
                        if (dialogMessage.includes("Successful")) {
                           onSwitch(); // Switch to login if registration was successful
                        }
                     }}
                  >
                     {dialogMessage.includes("Successful")
                        ? "Go to Login"
                        : "Try Again"}
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default Register;
