import React from "react";
import Tasks from "../components/Tasks";
import { Link, Outlet } from "react-router-dom";

function TaskPage() {
  return (
    <div>
      <h3>TaskPage</h3>
      <Tasks />
      <button>
        <Link to="add">Add Task</Link>
      </button>
      <Outlet />
    </div>
  );
}

export default TaskPage;
