import React from "react";

function Folder({ name, onClick }) {
   return (
      <div className="folder" onClick={onClick}>
         📁 {name}
      </div>
   );
}

export default Folder;
