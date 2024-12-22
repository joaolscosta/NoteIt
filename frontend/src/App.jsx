import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="App">
      <h1>NoteIt</h1>
      {isRegistering ? (
        <Register onSwitch={() => setIsRegistering(false)} />
      ) : (
        <Login onSwitch={() => setIsRegistering(true)} />
      )}
    </div>
  );
}

export default App;
