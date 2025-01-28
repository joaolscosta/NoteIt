import React, { useState, useEffect } from "react";
import axios from "axios";

function Sidebar() {
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [taskInput, setTaskInput] = useState("");
   const [tasks, setTasks] = useState([]);

   const openDialog = () => {
      setIsDialogOpen(true);
   };

   const closeDialog = () => {
      setIsDialogOpen(false);
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

            if (response.status === 200) {
               const newTask = {
                  id: response.data.id, // Supondo que o servidor retorne o id da nova tarefa
                  task: taskInput,
               };

               // Atualiza diretamente o estado de tarefas
               setTasks((prevTasks) => [...prevTasks, newTask]);
               setTaskInput(""); // Limpa o campo de input
               closeDialog(); // Fecha o diálogo
            }
         } catch (error) {
            console.error("There was an error adding the task:", error);
         }
      }
   };

   const fetchTasks = async () => {
      const username = localStorage.getItem("username");
      if (username) {
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

         {/* Dialog */}
         {isDialogOpen && (
            <div className="dialog-newtask-overlay">
               <div className="dialog-newtask-box">
                  <form onSubmit={addTask}>
                     <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Enter task..."
                     />
                     <button type="submit">Create</button>
                  </form>
                  <button onClick={closeDialog}>Cancel</button>
               </div>
            </div>
         )}
      </div>
   );
}

export default Sidebar;
