import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TaskList.css";

import ChatBotWidget from "./ChatBotWidget";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Unauthorized! Redirecting to login.");
        navigate("/");
      } else {
        toast.error("Failed to fetch tasks!");
      }
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask) {
      toast.warn("Task title cannot be empty!");
      return;
    }

    try {
      await API.post("/tasks", { title: newTask, description: newDescription });
      setNewTask("");
      setNewDescription("");
      toast.success("Task added successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add task!");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully!");
    navigate("/"); // redirect to login page
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 

  return (
    
    <div className="task-list-container">
       <div className="task-header">
        <h2>Task List</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <br></br>
      {/* FORM onSubmit now hooked */}
      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-items">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div>
              <strong>{task.title}</strong>: {task.description}
            </div>
            {/* Delete button hooked */}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>



      <ToastContainer />
        <ChatBotWidget />
    </div>
  );
}
