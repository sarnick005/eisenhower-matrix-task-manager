import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.Models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCookieOptions } from "../utils/getCookieOptions.js";
import { deleteFilesFromCloudinary } from "../utils/deleteFilesFromCloudinary.js";
import jwt from "jsonwebtoken";
import { Task } from "../models/task.Models.js";

// Add task

const addTask = asyncHandler(async (req, res) => {
  const { taskTitle, taskDescription, taskPriority, taskDeadline } = req.body;
  const taskOwnerID = req.user._id;
  console.log(taskOwnerID);

  if (
    [taskTitle, taskDescription, taskPriority, taskDeadline].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiErrors(400, "All fields are required");
  }

  const existedUser = await User.findById(taskOwnerID);
  if (!existedUser) {
    throw new ApiErrors(500, "User not found! Can't add task");
  }

  const newTask = await Task.create({
    taskOwnerID,
    taskTitle,
    taskDescription,
    taskPriority,
    taskDeadline,
  });

  if (!newTask) {
    throw new ApiErrors(500, "Something went wrong while adding new task");
  }

  console.log(`NEW TASK ADDED`);

  return res
    .status(201)
    .json(new ApiResponse(200, newTask, "New task added successfully"));
});

// Update task details

const updateTask = asyncHandler(async (req, res) => {
  const { taskTitle, taskDescription, taskPriority, taskDeadline } = req.body;
  const { taskID } = req.params;

  if (
    [taskTitle, taskDescription, taskPriority, taskDeadline].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiErrors(400, "All fields are required");
  }

  const existedTask = await Task.findById(taskID);
  if (!existedTask) {
    throw new ApiErrors(500, "Task not found! Can't update task");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskID,
    { taskTitle, taskDescription, taskPriority, taskDeadline },
    { new: true }
  );

  if (!updatedTask) {
    throw new ApiErrors(500, "Something went wrong while updating task");
  }

  console.log(`TASK UPDATED`);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const { taskID } = req.params;

  const existedTask = await Task.findById(taskID);
  if (!existedTask) {
    throw new ApiErrors(500, "Task not found! Can't delete task");
  }

  await Task.findByIdAndDelete(taskID);

  console.log(`TASK DELETED`);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

// Read task
const readTask = asyncHandler(async (req, res) => {
  const { taskID } = req.params;

  const task = await Task.findById(taskID);
  if (!task) {
    throw new ApiErrors(500, "Task not found!");
  }

  console.log(`TASK FETCHED`);

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

// Mark as done / toggle task status
const toggleTaskStatus = asyncHandler(async (req, res) => {
  const { taskID } = req.params;

  const task = await Task.findById(taskID);
  if (!task) {
    throw new ApiErrors(500, "Task not found! Can't toggle status");
  }

  task.taskStatus = !task.taskStatus;
  await task.save();

  console.log(`TASK STATUS TOGGLED`);

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status toggled successfully"));
});

// Get all tasks for a user
const getAllTasks = asyncHandler(async (req, res) => {
  const taskOwnerId = req.user._id;
  console.log("User ID:", taskOwnerId);

  const allTasks = await Task.find({ taskOwnerID: taskOwnerId });
  // console.log("Tasks:", allTasks);

  if (allTasks.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No tasks found for this user."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allTasks, "Tasks retrieved successfully"));
});


export {
  addTask,
  updateTask,
  deleteTask,
  readTask,
  toggleTaskStatus,
  getAllTasks,
};
