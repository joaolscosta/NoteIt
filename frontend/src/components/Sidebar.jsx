import React from "react";

function Sidebar() {
   return (
      <div className="sidebar">
         <div className="note-title">
            Note<div className="it-title">It</div>
         </div>
         <button className="button-library">Library</button>
         <button className="button-new-task">New Task</button>
         <hr className="divider" />
         <p className="tasks-title">Tasks left for today:</p>
      </div>
   );
}

export default Sidebar;
