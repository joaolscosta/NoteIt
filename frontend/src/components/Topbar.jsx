import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";
import axios from "axios";

const api = axios.create({
   withCredentials: true,
});

function Topbar({ username, setUsername, onLogout }) {
   const navigate = useNavigate();
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   const logout = async () => {
      try {
         const response = await api.post("http://localhost:5000/logout");
         return response.data;
      } catch (error) {
         console.error("Error fetching tasks:", error);
      }
   };

   const handleLogout = () => {
      onLogout();
      logout();
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
            setUsername={setUsername}
         />
      </div>
   );
}

export default Topbar;
