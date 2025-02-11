import React, { useState } from "react";
import { marked } from "marked";
import axios from "axios";

const Note = ({ setView }) => {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");

   return (
      <div className="note-container">
         <div className="note-header">
            <button className="button-back-library" onClick={() => setView("library")}>
               Library
            </button>
            <input
               type="text"
               className="note-title-input"
               placeholder="Enter note title..."
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            <div className="button-save-note">Save</div>
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
