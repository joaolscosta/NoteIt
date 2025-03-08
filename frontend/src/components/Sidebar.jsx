import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
   withCredentials: true,
});

function Sidebar({ setView, currentFolder, username }) {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [taskInput, setTaskInput] = useState("");
   const [tasks, setTasks] = useState([]);
   const [clearDialogOpen, setClearDialogOpen] = useState(false);
   const [showFolderWarning, setShowFolderWarning] = useState(false);
   const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

   const openDialog = () => setIsDialogOpen(true);
   const closeDialog = () => {
      setIsDialogOpen(false);
      setTaskInput("");
   };

   const fetchTasks = async () => {
      if (!username) return;

      try {
         const response = await api.get(`http://localhost:5000/tasks?username=${username}`);
         if (response.status === 200) {
            setTasks(response.data.tasks);
         }
      } catch (error) {
         console.error("Error fetching tasks:", error);
      }
   };

   const addTask = async (event) => {
      event.preventDefault();

      if (taskInput.trim() !== "") {
         try {
            const response = await api.post("http://localhost:5000/addtask", {
               username: username,
               task_text: taskInput,
            });

            if (response.status === 201) {
               setTaskInput("");
               closeDialog();
               fetchTasks();
            } else {
               console.error("Invalid response from server:", response.data);
            }
         } catch (error) {
            console.error("Error adding task:", error);
         }
      }
   };

   const toggleTaskCompletion = async (taskId, currentStatus) => {
      try {
         const response = await api.post("http://localhost:5000/complete_task", { task_id: taskId });
         if (response.status === 200) {
            setTasks((prevTasks) =>
               prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !currentStatus } : task))
            );
         }
      } catch (error) {
         console.error("Error toggling task completion:", error);
      }
   };

   const deleteTask = async (taskId) => {
      try {
         const response = await api.post("http://localhost:5000/delete_task", {
            task_id: taskId,
         });

         if (response.status === 200) {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
         }
      } catch (error) {
         console.error("Error deleting task:", error);
      }
   };

   const handleClearDialogOpen = () => {
      setClearDialogOpen(true);
   };

   const handleClearDialogClose = () => {
      setClearDialogOpen(false);
   };

   const deleteAllTasks = async () => {
      try {
         const response = await api.post("http://localhost:5000/delete_all_tasks", {
            username: username,
         });

         if (response.status === 200) {
            setTasks([]);
            handleClearDialogClose();
         }
      } catch (error) {
         console.error("Error deleting all tasks:", error);
      }
   };

   useEffect(() => {
      fetchTasks();
   }, [username]);

   return (
      <div className="sidebar">
         <div className="note-title">
            Note<div className="it-title">It</div>
         </div>
         <button
            className="button-new-note"
            onClick={() => {
               if (!currentFolder?.id) {
                  setShowFolderWarning(true);
               } else {
                  setView("note");
               }
            }}>
            New Note
         </button>
         <button className="button-new-task" onClick={openDialog}>
            New Task
         </button>
         <hr className="divider" />
         <p className="tasks-title">Tasks left for today:</p>
         <div className="tasks-container">
            {tasks.length > 0 ? (
               tasks.map((task) => (
                  <div key={task.id} className="task-item">
                     <button className="task-icon-button" onClick={() => toggleTaskCompletion(task.id, task.completed)}>
                        <i className={`fa-2x ${task.completed ? "fas fa-check-circle" : "far fa-circle"}`}></i>
                     </button>
                     <span className={task.completed ? "task-completed" : ""}>{task.task}</span>
                     <button className="delete-task-icon" onClick={() => deleteTask(task.id)}>
                        <i className="fas fa-trash-alt fa-lg"></i>
                     </button>
                  </div>
               ))
            ) : (
               <p className="no-tasks">No tasks available</p>
            )}
         </div>
         <div className="bottom-sidebar">
            <button className="clear-tasks-button" onClick={handleClearDialogOpen}>
               Clear tasks
            </button>
            <div className="help-container">
               <button className="help-button" onClick={() => setShowMarkdownHelp(true)}>
                  <i className="fas fa-question-circle"></i>Help
               </button>
            </div>
         </div>

         {showMarkdownHelp && (
            <div className="dialog-overlay">
               <div className="dialog markdown-help">
                  <h2>Markdown Guide</h2>
                  <div className="markdown-instructions">
                     <h3>Markdown Formatting Guide</h3>
                     <ul>
                        <li>
                           Titles:
                           <br />
                           <code># Main Title</code>
                           <br />
                        </li>
                        <li>
                           Subtitles:
                           <br />
                           <code>## Subtitle</code>
                           <br />
                        </li>
                        <li>
                           Bold text:
                           <br />
                           <code>**important text**</code>
                           <br />
                        </li>
                        <li>
                           Italic text:
                           <br />
                           <code>*emphasized text*</code>
                           <br />
                        </li>
                        <li>
                           Bullet list:
                           <br />
                           <code>- first item</code>
                           <br />
                           <code>- second item</code>
                           <br />
                        </li>
                        <li>
                           Numbered list:
                           <br />
                           <code>1. first step</code>
                           <br />
                           <code>2. second step</code>
                           <br />
                        </li>
                        <li>
                           Code:
                           <br />
                           <code>`code here`</code>
                           <br />
                        </li>
                        <li>
                           Links:
                           <br />
                           <code>[text to show](https://url.com)</code>
                           <br />
                        </li>
                     </ul>
                  </div>
                  <div className="dialog-buttons">
                     <button onClick={() => setShowMarkdownHelp(false)}>Close</button>
                  </div>
               </div>
            </div>
         )}

         {showFolderWarning && (
            <div className="dialog-overlay">
               <div className="dialog">
                  <h2>Cannot Create Note Here</h2>
                  <p>Please create or select a folder first before creating a note.</p>
                  <div className="dialog-buttons">
                     <button onClick={() => setShowFolderWarning(false)}>OK</button>
                  </div>
               </div>
            </div>
         )}

         {isDialogOpen && (
            <div
               className="dialog-register-overlay"
               onClick={(e) => {
                  if (e.target === e.currentTarget) {
                     closeDialog();
                  }
               }}>
               <div className="dialog-newtask-box">
                  <form onSubmit={addTask}>
                     <textarea
                        className="task-input"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Enter task..."></textarea>
                     <div className="task-input-container">
                        <button type="button" className="button-task-input-cancel" onClick={closeDialog}>
                           Cancel
                        </button>
                        <button type="submit" className="button-task-input-add">
                           Add
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {clearDialogOpen && (
            <div className="dialog-overlay">
               <div className="dialog">
                  <h2>Clear All Tasks</h2>
                  <p>Are you sure you want to clear all tasks? This action cannot be undone.</p>
                  <div className="dialog-buttons">
                     <button onClick={handleClearDialogClose}>Cancel</button>
                     <button onClick={deleteAllTasks} className="delete-button">
                        I'm sure
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Sidebar;
