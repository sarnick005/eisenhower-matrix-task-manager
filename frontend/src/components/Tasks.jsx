import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/v1/task/all");
        setTasks(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 text-lg">Loading tasks...</p>
    );
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h3 className="text-3xl font-extrabold mb-8 text-gray-900">Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-600 text-lg">No tasks found</p>
      ) : (
        <ul className="space-y-6">
          {tasks.map((task) => (
            <motion.li
              key={task._id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
            >
              <h4 className="text-2xl font-semibold text-gray-900 mb-3">
                {task.taskTitle}
              </h4>
              <p className="text-gray-700 mb-3">{task.taskDescription}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <p>
                  Priority:{" "}
                  <span
                    className={`px-2 py-1 rounded-full ${
                      task.taskPriority === "do"
                        ? "bg-blue-200 text-blue-800"
                        : task.taskPriority === "decide"
                        ? "bg-yellow-200 text-yellow-800"
                        : task.taskPriority === "delegate"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {task.taskPriority.charAt(0).toUpperCase() +
                      task.taskPriority.slice(1)}
                  </span>
                </p>
                <p>
                  Deadline:{" "}
                  <span className="font-semibold">
                    {new Date(task.taskDeadline).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`ml-2 px-3 py-1 rounded-full ${
                    task.taskStatus
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.taskStatus ? "Completed" : "Pending"}
                </span>
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default Tasks;
