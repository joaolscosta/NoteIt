import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Library from "./Library";
import Note from "./Note";

const MainPage = () => {
   const [view, setView] = useState("library");
   const [currentFolder, setCurrentFolder] = useState({ id: null, name: "/" });
   const [selectedNote, setSelectedNote] = useState(null);

   const resetToRoot = () => {
      setCurrentFolder({ id: null, name: "/" });
      setSelectedNote(null);
      setView("library");
   };

   return (
      <div className="main-page">
         <Topbar />
         <Sidebar setView={setView} currentFolder={currentFolder} />
         {view === "library" ? (
            <Library
               setView={setView}
               currentFolder={currentFolder}
               setCurrentFolder={setCurrentFolder}
               setSelectedNote={setSelectedNote}
            />
         ) : (
            <Note
               currentFolder={currentFolder}
               setView={setView}
               selectedNote={selectedNote}
               setSelectedNote={setSelectedNote}
               resetToRoot={resetToRoot}
            />
         )}
      </div>
   );
};

export default MainPage;
