import React, { useState } from "react";
import { marked } from "marked";
import axios from "axios";

const Note = ({ setView, currentFolder, selectedNote, setSelectedNote, resetToRoot }) => {
   const [title, setTitle] = useState(selectedNote?.title || "");
   const [content, setContent] = useState(selectedNote?.text || "");
   const [isSaving, setIsSaving] = useState(false);

   const handleBack = () => {
      setSelectedNote(null);
      setView("library");
   };

   const handleSave = async () => {
      if (!title.trim() || !content.trim() || !currentFolder?.id) return;

      setIsSaving(true);
      try {
         const username = localStorage.getItem("username");
         const trimmedTitle = title.trim();
         const trimmedContent = content.trim();

         if (selectedNote?.id) {
            const response = await axios.post("http://localhost:5000/update_note", {
               username,
               note_id: selectedNote.id,
               note_title: trimmedTitle,
               note_text: trimmedContent,
            });

            if (response.status === 200) {
               resetToRoot();
            }
         } else {
            const response = await axios.post("http://localhost:5000/add_note", {
               username,
               folder_id: currentFolder.id,
               note_title: trimmedTitle,
               note_text: trimmedContent,
            });

            if (response.status === 201) {
               resetToRoot();
            }
         }
      } catch (error) {
         console.error("Error saving note:", error);
         alert("Failed to save note: " + (error.response?.data?.message || "Please try again."));
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="note-container">
         <div className="note-header">
            <button className="button-back-library" onClick={resetToRoot}>
               Library
            </button>
            <input
               type="text"
               className="note-title-input"
               placeholder="Enter note title..."
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            <button
               className={`button-save-note ${!title.trim() || !content.trim() ? "disabled" : ""}`}
               onClick={handleSave}
               disabled={!title.trim() || !content.trim() || isSaving}>
               {isSaving ? "Saving..." : "Save"}
            </button>
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
