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
            `http://localhost:5000/get_folders?username=${username}&parent_id=${
               parentId || ""
            }`
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

   const navigateToFolder = (folderId, folderName) => {
      setCurrentPath([...currentPath, folderName]);
      setParentId(folderId);
   };

   const goBack = () => {
      if (currentPath.length === 0) return;
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);
      setParentId(
         newPath.length > 0
            ? folders.find((f) => f.name === newPath[newPath.length - 1])?.id
            : null
      );
   };

   return (
      <div className="library-container">
         <div className="library-title">Library</div>
         <div className="library-file-path">
            <span
               onClick={() => {
                  setCurrentPath([]);
                  setParentId(null);
               }}
            >
               {" "}
               /{" "}
            </span>
            {currentPath.map((folder, index) => (
               <span
                  key={index}
                  onClick={() => setParentId(folders[index]?.id)}
               >
                  / {folder}
               </span>
            ))}
         </div>
         <div className="library-content">
            <button onClick={addFolder}>Add Folder</button>
            {currentPath.length > 0 && <button onClick={goBack}>Back</button>}
            {folders.map((folder) => (
               <Folder
                  key={folder.id}
                  name={folder.name}
                  onClick={() => navigateToFolder(folder.id, folder.name)}
               />
            ))}
         </div>
      </div>
   );
}

export default Library;
