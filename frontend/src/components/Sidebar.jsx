import React, { useState, useEffect } from "react";
import axios from "axios";

function Sidebar() {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [taskInput, setTaskInput] = useState("");
   const [tasks, setTasks] = useState([]);

   const openDialog = () => setIsDialogOpen(true);
   const closeDialog = () => {
      setIsDialogOpen(false);
      setTaskInput("");
   };

   const fetchTasks = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
         const response = await axios.get(
            `http://localhost:5000/tasks?username=${username}`
         );
         if (response.status === 200) {
            setTasks(response.data.tasks);
         }
      } catch (error) {
         console.error("Error fetching tasks:", error);
      }
   };

   useEffect(() => {
      fetchTasks();
   }, []);

   const addTask = async (event) => {
      event.preventDefault();

      if (taskInput.trim() !== "") {
         try {
            const username = localStorage.getItem("username");
            const response = await axios.post("http://localhost:5000/addtask", {
               username: username,
               task_text: taskInput,
            });

            if (response.status === 201 && response.data.id) {
               setTasks((prevTasks) => [
                  ...prevTasks,
                  { id: response.data.id, task: taskInput },
               ]);

               setTaskInput("");
               fetchTasks();
            } else {
               console.error("Invalid response from server:", response.data);
            }
         } catch (error) {
            console.error("Error adding task:", error);
         }
      }
   };

   return (
      <div className="sidebar">
         <div className="note-title">
            Note<div className="it-title">It</div>
         </div>
         <button className="button-library">Library</button>
         <button className="button-new-task" onClick={openDialog}>
            New Task
         </button>
         <hr className="divider" />
         <p className="tasks-title">Tasks left for today:</p>

         <ul>
            {tasks.length > 0 ? (
               tasks.map((task) => <li key={task.id}>{task.task}</li>)
            ) : (
               <p>No tasks for today.</p>
            )}
         </ul>

         {isDialogOpen && (
            <div
               className="dialog-register-overlay"
               onClick={(e) => {
                  if (e.target === e.currentTarget) {
                     closeDialog();
                  }
               }}
            >
               <div className="dialog-newtask-box">
                  <form onSubmit={addTask}>
                     <textarea
                        className="task-input"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Enter task..."
                     ></textarea>
                     <div className="task-input-container">
                        <button
                           type="button"
                           className="button-task-input-cancel"
                           onClick={closeDialog}
                        >
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
      </div>
   );
}

export default Sidebar;
