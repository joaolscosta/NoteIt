import React, { useState, useEffect } from "react";
import axios from "axios";

function Library() {
   const [folders, setFolders] = useState([]);
   const [path, setPath] = useState(["/"]);

   useEffect(() => {
      fetchFolders();
   }, [path]);

   const fetchFolders = async () => {
      try {
         const username = localStorage.getItem("username");
         const parentId = path.length > 1 ? path[path.length - 1].id : null;
         const response = await axios.get("http://localhost:5000/get_folders", {
            params: { username, parent_id: parentId },
         });
         setFolders(response.data.folders);
      } catch (error) {
         console.error("Error fetching folders:", error);
      }
   };

   const addFolder = async () => {
      const folderName = prompt("Enter folder name:");
      if (!folderName) return;

      if (folderName.length > 30) {
         alert("Folder name should be less than 30 characters");
         return;
      }
      try {
         const username = localStorage.getItem("username");
         const parentId = path.length > 1 ? path[path.length - 1].id : null;
         await axios.post("http://localhost:5000/create_folder", {
            username,
            folder_name: folderName,
            parent_id: parentId,
         });

         fetchFolders();
      } catch (error) {
         console.error("Error creating folder:", error);
      }
   };

   const handleFolderClick = (folder) => {
      setPath((prevPath) => [...prevPath, folder]);
   };

   const handleBackClick = () => {
      setPath((prevPath) => prevPath.slice(0, prevPath.length - 1));
   };

   const deleteFolder = async (folderId, folderName, event) => {
      event.stopPropagation();

      if (!window.confirm(`Are you sure you want to delete the folder "${folderName}"?`)) {
         // TODO: change to dialog
         return;
      }

      try {
         await axios.post("http://localhost:5000/delete_folder", { folder_id: folderId });
         fetchFolders();
      } catch (error) {
         console.error("Error deleting folder:", error);
      }
   };

   return (
      <div className="library-container">
         <div className="library-header">
            <div className="library-title">Library</div>
            <div className="library-file-path">
               {path.map((folder, index) => (
                  <span key={index}>
                     {folder === "/" ? "" : folder.name}
                     {index < path.length - 1 && " / "}
                  </span>
               ))}
            </div>
         </div>

         <div className="library-folder-managment-container">
            <button className="button-add-folder" onClick={addFolder}>
               + New Folder
            </button>
            {path.length > 1 && (
               <button className="button-add-folder" onClick={handleBackClick}>
                  Back
               </button>
            )}
         </div>

         <ul className="folder-list">
            {folders.map((folder) => (
               <li key={folder.id} className="folder-item" onClick={() => handleFolderClick(folder)}>
                  📁 {folder.name}
                  <button
                     className="delete-folder-button"
                     onClick={(event) => deleteFolder(folder.id, folder.name, event)}>
                     <i className="fas fa-trash-alt fa-lg"></i>
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default Library;
