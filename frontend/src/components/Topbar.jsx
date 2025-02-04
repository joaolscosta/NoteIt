import React from "react";
import { useNavigate } from "react-router-dom";

function Topbar() {
   const navigate = useNavigate();
   const username = localStorage.getItem("username");

   const handleLogout = () => {
      localStorage.removeItem("username");
      navigate("/");
   };

   return (
      <div className="topbar">
         <div className="topbar-buttons">
            <button className="topbar-profile-button">{username ? username : "Profile"}</button>
            <button className="topbar-simple-button">Settings</button>
            <button className="topbar-simple-button" onClick={handleLogout}>
               Logout
            </button>
         </div>
      </div>
   );
}

export default Topbar;
