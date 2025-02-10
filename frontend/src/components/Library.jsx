import React, { useState, useEffect } from "react";
import axios from "axios";

function Library({ setView, currentFolder, setCurrentFolder }) {
   const [folders, setFolders] = useState([]);
   const [path, setPath] = useState([{ id: null, name: " " }]);

   useEffect(() => {
      fetchFolders();
   }, [currentFolder]);

   const fetchFolders = async () => {
      try {
         const username = localStorage.getItem("username");
         const parentId = currentFolder.id;
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
      if (!folderName || folderName.length > 30) {
         alert("Folder name should be less than 30 characters.");
         return;
      }

      try {
         const username = localStorage.getItem("username");
         const parentId = currentFolder.id;
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
      setCurrentFolder(folder);
      setPath([...path, folder]);
   };

   const handlePathClick = (index) => {
      const newPath = path.slice(0, index + 1);
      setPath(newPath);
      setCurrentFolder(newPath[index]);
   };

   const handleBackClick = () => {
      if (path.length > 1) {
         const newPath = path.slice(0, -1);
         setPath(newPath);
         setCurrentFolder(newPath[newPath.length - 1]);
      }
   };

   const deleteFolder = async (folderId, folderName, event) => {
      event.stopPropagation();
      if (!window.confirm(`Are you sure you want to delete the folder "${folderName}"?`)) return;

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
                     {index < path.length - 1 ? (
                        <a className="library-file-path" onClick={() => handlePathClick(index)}>
                           {folder.name}
                        </a>
                     ) : (
                        <span>{folder.name}</span>
                     )}
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
