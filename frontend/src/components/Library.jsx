import React, { useState, useEffect } from "react";
import Folder from "./Folder";

function Library() {
   const [folders, setFolders] = useState([]);
   const [currentPath, setCurrentPath] = useState([]);
   const [parentId, setParentId] = useState(null);
   const username = localStorage.getItem("username");

   const fetchFolders = async (parentId) => {
      try {
         const response = await fetch(
            `http://localhost:5000/get_folders?username=${username}&parent_id=${parentId || ""}`
         );
         const data = await response.json();
         if (response.ok) {
            setFolders(data.folders);
         } else {
            console.error("Error fetching folders:", data.message);
         }
      } catch (error) {
         console.error("Network error:", error);
      }
   };

   useEffect(() => {
      fetchFolders(parentId);
   }, [parentId]);

   const addFolder = async () => {
      const folderName = prompt("Enter folder name:");
      if (!folderName) return;

      try {
         const response = await fetch("http://localhost:5000/create_folder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               username: username,
               folder_name: folderName,
               parent_id: parentId ?? null,
            }),
         });

         const data = await response.json();
         if (response.ok) {
            fetchFolders(parentId);
         } else {
            console.error("Error creating folder:", data.message);
         }
      } catch (error) {
         console.error("Network error:", error);
      }
   };

   return (
      <div className="library-container">
         <div className="library-title">Library</div>
         <div className="library-file-path">
            <span>/</span>
         </div>
      </div>
   );
}

export default Library;
