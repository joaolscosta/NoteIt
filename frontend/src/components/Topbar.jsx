import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";

function Topbar({ username, onLogout }) {
   const navigate = useNavigate();
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   const handleLogout = () => {
      onLogout();
      navigate("/");
   };

   return (
      <div className="topbar">
         <div className="topbar-buttons">
            <button className="topbar-profile-button">{username || "Profile"}</button>
            <button className="topbar-simple-button" onClick={() => setIsSettingsOpen(true)}>
               Settings
            </button>
            <button username="" className="topbar-simple-button" onClick={handleLogout}>
               Logout
            </button>
         </div>
         <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            username={username}
            setUsername={onLogout}
         />
      </div>
   );
}

export default Topbar;
