import React from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const MainPage = () => {
   return (
      <div className="main-page">
         <Topbar />
         <div className="content">
            <Sidebar />
         </div>
      </div>
   );
};

export default MainPage;
