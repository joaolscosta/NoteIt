import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Settings({ isOpen, onClose, username, setUsername }) {
   const [newUsername, setNewUsername] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [currentPassword, setCurrentPassword] = useState("");
   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
         const response = await axios.put("http://localhost:5000/update-user", {
            currentUsername: username,
            newUsername: newUsername || username,
            currentPassword,
            newPassword: newPassword || currentPassword,
         });

         if (response.status === 200) {
            if (newUsername) {
               setUsername(newUsername);
            }
            onClose();
            window.location.reload();
         }
      } catch (err) {
         setError(err.response?.data?.message || "Failed to update settings. Please try again.");
      }
   };

   if (!isOpen) return null;

   return (
      <div className="dialog-overlay">
         <div className="dialog">
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
               <div className="form-group">
                  <label>New Username (optional):</label>
                  <input
                     type="text"
                     value={newUsername}
                     onChange={(e) => setNewUsername(e.target.value)}
                     placeholder="Enter new username"
                  />
               </div>
               <div className="form-group">
                  <label>Current Password:</label>
                  <input
                     type="password"
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     required
                     placeholder="Enter current password"
                  />
               </div>
               <div className="form-group">
                  <label>New Password (optional):</label>
                  <input
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="Enter new password"
                  />
               </div>
               {error && <div className="error-message">{error}</div>}
               <div className="dialog-buttons">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={onClose}>
                     Cancel
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default Settings;
