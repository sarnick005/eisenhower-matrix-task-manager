import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

function NewTaskForm() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("do");
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userID = localStorage.getItem("userId"); 

      await axios.post("/api/v1/task/add", {
        taskOwnerID: userID,
        taskTitle,
        taskDescription,
        taskPriority,
        taskDeadline,
      });

      navigate("/task");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">New Task Form</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="taskTitle">
            Task Title:
          </label>
          <input
            id="taskTitle"
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="taskDescription"
          >
            Task Description:
          </label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
            rows="4"
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Task Priority:
          </label>
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="do">Do</option>
            <option value="decide">Decide</option>
            <option value="delegate">Delegate</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Task Deadline:
          </label>
          <DatePicker
            selected={taskDeadline}
            onChange={(date) => setTaskDeadline(date)}
            minDate={new Date()}
            className="w-full border-gray-300 rounded-md shadow-sm"
            dateFormat="MMMM d, yyyy"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

export default NewTaskForm;
