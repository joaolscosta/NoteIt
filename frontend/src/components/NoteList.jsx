import React from "react";

function NoteList({ notes }) {
    return (
        <div className="note-list">
            <h3>Your Notes</h3>
            {notes.length === 0 ? (
                <p>No notes yet.</p>
            ) : (
                <ul>
                    {notes.map((note, index) => (
                        <li key={index}>
                            <h4>{note.title}</h4>
                            <p>{note.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default NoteList;
