import React, { useState, useEffect } from "react";
import axios from "axios";

function Sidebar({ setView }) {
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
         const response = await axios.get(`http://localhost:5000/tasks?username=${username}`);
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
            const username = localStorage.getItem("username");
            const response = await axios.post("http://localhost:5000/addtask", {
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
         const response = await axios.post("http://localhost:5000/complete_task", { task_id: taskId });
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
         const response = await axios.post("http://localhost:5000/delete_task", {
            task_id: taskId,
         });

         if (response.status === 200) {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
         }
      } catch (error) {
         console.error("Error deleting task:", error);
      }
   };

   const deleteAllTasks = async () => {
      try {
         const response = await axios.post("http://localhost:5000/delete_all_tasks", {
            username: localStorage.getItem("username"),
         });

         if (response.status === 200) {
            setTasks([]);
         }
      } catch (error) {
         console.error("Error deleting all tasks:", error);
      }
   };

   useEffect(() => {
      fetchTasks();
   }, []);

   return (
      <div className="sidebar">
         <div className="note-title">
            Note<div className="it-title">It</div>
         </div>
         <button className="button-new-note" onClick={() => setView("note")}>
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
            <button className="clear-tasks-button" onClick={deleteAllTasks}>
               Clear tasks
            </button>
            <div className="help-container">
               <button className="help-button">
                  <i className="fas fa-question-circle"></i>Help
               </button>
            </div>
         </div>

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
      </div>
   );
}

export default Sidebar;
