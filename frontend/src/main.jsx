import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import {
  HomePage,
  LoginPage,
  SignUpPage,
  TaskPage,
  TaskDescriptionPage,
  UpdateTaskPage,
  NewTaskFormPage,
} from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="task" element={<TaskPage />}>
        <Route path="add" element={<NewTaskFormPage />} />
        <Route path="description/:taskID" element={<TaskDescriptionPage />} />
        <Route path="update/:taskID" element={<UpdateTaskPage />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
