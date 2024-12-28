import React, { useState } from "react";

function NoteForm({ onAddNote }) {
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      if (title && description) {
         const newNote = { title, description };
         onAddNote(newNote);
         setTitle("");
         setDescription("");
      }
   };

   return (
      <div className="note-form">
         <h3>Add a New Note</h3>
         <form onSubmit={handleSubmit}>
            <input
               type="text"
               placeholder="Note Title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
               placeholder="Note Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Note</button>
         </form>
      </div>
   );
}

export default NoteForm;
