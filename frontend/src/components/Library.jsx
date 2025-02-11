import React, { useState, useEffect } from "react";
import axios from "axios";

function Library({ setView, currentFolder, setCurrentFolder }) {
   const [folders, setFolders] = useState([]);
   const [path, setPath] = useState([{ id: null, name: " " }]);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [newFolderName, setNewFolderName] = useState("");
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [folderToDelete, setFolderToDelete] = useState(null);

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

   const handleDialogOpen = () => {
      setIsDialogOpen(true);
      setNewFolderName("");
   };

   const handleDialogClose = () => {
      setIsDialogOpen(false);
      setNewFolderName("");
   };

   const addFolder = async () => {
      if (!newFolderName || newFolderName.length > 30) {
         alert("Folder name should be less than 30 characters.");
         return;
      }

      try {
         const username = localStorage.getItem("username");
         const parentId = currentFolder.id;
         await axios.post("http://localhost:5000/create_folder", {
            username,
            folder_name: newFolderName,
            parent_id: parentId,
         });

         fetchFolders();
         handleDialogClose();
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

   const handleDeleteDialogOpen = (folder, event) => {
      event.stopPropagation();
      setFolderToDelete(folder);
      setDeleteDialogOpen(true);
   };

   const handleDeleteDialogClose = () => {
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
   };

   const deleteFolder = async () => {
      if (!folderToDelete) return;

      try {
         await axios.post("http://localhost:5000/delete_folder", { folder_id: folderToDelete.id });
         fetchFolders();
         handleDeleteDialogClose();
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
            <button className="button-add-folder" onClick={handleDialogOpen}>
               + New Folder
            </button>

            {isDialogOpen && (
               <div className="dialog-overlay">
                  <div className="dialog">
                     <h2>Create New Folder</h2>
                     <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Enter folder name"
                        maxLength={30}
                     />
                     <div className="dialog-buttons">
                        <button onClick={handleDialogClose}>Cancel</button>
                        <button onClick={addFolder}>Create</button>
                     </div>
                  </div>
               </div>
            )}
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
                  <button className="delete-folder-button" onClick={(event) => handleDeleteDialogOpen(folder, event)}>
                     <i className="fas fa-trash-alt fa-lg"></i>
                  </button>
               </li>
            ))}
         </ul>

         {deleteDialogOpen && (
            <div className="dialog-overlay">
               <div className="dialog">
                  <h2>Delete Folder</h2>
                  <p>Are you sure you want to delete the folder "{folderToDelete?.name}"?</p>
                  <div className="dialog-buttons">
                     <button onClick={handleDeleteDialogClose}>Cancel</button>
                     <button onClick={deleteFolder} className="delete-button">
                        I'm sure
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Library;
