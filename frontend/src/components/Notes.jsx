import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";

function Notes() {
    const [notes, setNotes] = useState([]); // Gerencia as notas no estado

    const addNote = (note) => {
        setNotes([...notes, note]);
    };

    return (
        <div className="notes-container">
            <Sidebar />
            <div className="content">
                <Topbar />
            </div>
        </div>
    );
}

export default Notes;
