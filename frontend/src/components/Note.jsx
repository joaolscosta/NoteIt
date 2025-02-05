import React, { useState } from "react";
import { marked } from "marked";
import axios from "axios";

const Note = ({ currentFolder }) => {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");

   const handleSave = async () => {
      const username = localStorage.getItem("username");

      if (!title.trim() || !content.trim()) {
         alert("Please provide both a title and content for the note.");
         return;
      }

      if (!currentFolder) {
         alert("Please select a folder to save the note.");
         return;
      }

      try {
         await axios.post("http://localhost:5000/add_note", {
            username,
            folder_id: currentFolder.id,
            note_title: title,
            note_text: content,
         });
         alert("Note saved successfully!");
      } catch (error) {
         console.error("Error saving note:", error);
         alert("Failed to save the note.");
      }
   };

   return (
      <div className="note-container">
         <div className="note-header">
            <input
               type="text"
               className="note-title-input"
               placeholder="Enter note title..."
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            <div className="button-save-note" onClick={handleSave}>
               Save
            </div>
         </div>

         <div className="note-content">
            <textarea
               className="markdown-editor"
               placeholder="Write your note in markdown..."
               value={content}
               onChange={(e) => setContent(e.target.value)}
            />
            <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: marked(content) }} />
         </div>
      </div>
   );
};

export default Note;
