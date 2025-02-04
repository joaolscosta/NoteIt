import React, { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Library from "./Library";
import Note from "./Note";

const MainPage = () => {
   const [view, setView] = useState("library");

   return (
      <div className="main-page">
         <Topbar />
         <Sidebar setView={setView} />
         {view === "library" ? <Library /> : <Note />}
      </div>
   );
};

export default MainPage;
