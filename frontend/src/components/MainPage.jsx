import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Library from "./Library";
import Note from "./Note";

const MainPage = () => {
   const [view, setView] = useState("library");
   const [currentFolder, setCurrentFolder] = useState({ id: null, name: "/" });

   return (
      <div className="main-page">
         <Topbar />
         <Sidebar setView={setView} />
         {view === "library" ? (
            <Library setView={setView} currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} />
         ) : (
            <Note currentFolder={currentFolder} setView={setView} />
         )}
      </div>
   );
};

export default MainPage;
