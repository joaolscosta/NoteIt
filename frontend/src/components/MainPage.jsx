import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Library from "./Library";

const MainPage = () => {
   return (
      <div className="main-page">
         <Topbar />
         <Sidebar />
         <Library />
      </div>
   );
};

export default MainPage;
