import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
   return (
      <div className="sidebar">
         <div className="note-title">
            Note<div className="it-title">It</div>
         </div>
         <button className="button-new-note">Create new note</button>
      </div>
   );
}

export default Sidebar;
