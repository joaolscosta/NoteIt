import React from "react";
import { useNavigate } from "react-router-dom";

function Topbar() {
   const navigate = useNavigate();

   const handleLogout = () => {
      navigate("/");
   };

   return (
      <div className="topbar">
         <div className="topbar-buttons">
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => navigate("/settings")}>Settings</button>
            <button onClick={handleLogout}>Logout</button>
         </div>
      </div>
   );
}

export default Topbar;
