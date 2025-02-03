import React, { useState, useEffect } from "react";
import axios from "axios";

function Library() {
   const [folders, setFolders] = useState([]);

   useEffect(() => {
      fetchFolders();
   }, []);

   const fetchFolders = async () => {
      try {
         const username = localStorage.getItem("username");
         const response = await axios.get("http://localhost:5000/get_folders", {
            params: { username },
         });
         setFolders(response.data.folders);
      } catch (error) {
         console.error("Error fetching folders:", error);
      }
   };

   const addFolder = async () => {
      const folderName = prompt("Enter folder name:"); // TODO: replace with a dialog
      if (!folderName) return;

      if (folderName.length > 30) {
         alert("Folder name should be less than 30 characters"); // TODO: replace with a dialog
         return;
      }
      try {
         const username = localStorage.getItem("username");
         await axios.post("http://localhost:5000/create_folder", {
            username,
            folder_name: folderName,
         });

         fetchFolders();
      } catch (error) {
         console.error("Error creating folder:", error);
      }
   };

   return (
      <div className="library-container">
         <div className="library-header">
            <div className="library-title">Library</div>
            <div className="library-file-path">
               <span>/ CSF / Note 123</span>
            </div>
         </div>

         <div className="library-folder-managment-container">
            <button className="button-add-folder" onClick={addFolder}>
               + New Folder
            </button>
         </div>

         <ul className="folder-list">
            {folders.map((folder) => (
               <li key={folder.id} className="folder-item">
                  📁 {folder.name}
               </li>
            ))}
         </ul>
      </div>
   );
}

export default Library;
