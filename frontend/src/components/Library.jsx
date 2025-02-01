import React, { useState } from "react";
import Folder from "./Folder";

function Library() {
   const [folders, setFolders] = useState([]);
   const [currentPath, setCurrentPath] = useState([]);

   const addFolder = () => {
      const folderName = prompt("Enter folder name:");
      if (folderName) {
         setFolders([
            ...folders,
            { name: folderName, path: [...currentPath, folderName] },
         ]);
      }
   };

   const navigateToFolder = (path) => {
      setCurrentPath(path);
   };

   const currentFolders = folders.filter(
      (folder) =>
         folder.path.slice(0, currentPath.length).join("/") ===
         currentPath.join("/")
   );

   return (
      <div className="library-container">
         <div className="library-title">Library</div>
         <div className="library-content">
            <button onClick={addFolder}>Add Folder</button>
            <div className="directory-path">
               <span onClick={() => setCurrentPath([])}>/</span>
               {currentPath.map((folder, index) => (
                  <span
                     key={index}
                     onClick={() =>
                        setCurrentPath(currentPath.slice(0, index + 1))
                     }
                  >
                     / {folder}
                  </span>
               ))}
            </div>
            {currentPath.length > 0 && (
               <button onClick={() => setCurrentPath(currentPath.slice(0, -1))}>
                  Back
               </button>
            )}
            {currentFolders.map((folder, index) => (
               <Folder
                  key={index}
                  name={folder.name}
                  onClick={() => navigateToFolder(folder.path)}
               />
            ))}
         </div>
      </div>
   );
}

export default Library;
