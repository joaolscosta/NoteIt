import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Library from "./Library";
import Note from "./Note";

const MainPage = ({ username, setUsername }) => {
   const [view, setView] = useState("library");
   const [currentFolder, setCurrentFolder] = useState({ id: null, name: "/" });
   const [selectedNote, setSelectedNote] = useState(null);

   const resetToRoot = () => {
      setCurrentFolder({ id: null, name: "/" });
      setSelectedNote(null);
      setView("library");
   };

   const handleLogout = () => {
      setUsername("");
   };

   return (
      <div className="main-page">
         <Topbar username={username} setUsername={setUsername} onLogout={handleLogout} />
         <Sidebar username={username} setView={setView} currentFolder={currentFolder} />
         {view === "library" ? (
            <Library
               username={username}
               setView={setView}
               currentFolder={currentFolder}
               setCurrentFolder={setCurrentFolder}
               setSelectedNote={setSelectedNote}
            />
         ) : (
            <Note
               username={username}
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
