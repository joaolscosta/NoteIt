import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";

function Topbar() {
   const navigate = useNavigate();
   const username = localStorage.getItem("username");
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   const handleLogout = () => {
      localStorage.removeItem("username");
      navigate("/");
   };

   return (
      <div className="topbar">
         <div className="topbar-buttons">
            <button className="topbar-profile-button">{username ? username : "Profile"}</button>
            <button className="topbar-simple-button" onClick={() => setIsSettingsOpen(true)}>Settings</button>
            <button className="topbar-simple-button" onClick={handleLogout}>
               Logout
            </button>
         </div>
         <Settings 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
         />
      </div>
   );
}

export default Topbar;
