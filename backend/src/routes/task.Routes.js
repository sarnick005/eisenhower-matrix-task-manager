import { Router } from "express";

import {
  addTask,
  updateTask,
  deleteTask,
  readTask,
  toggleTaskStatus,
  getAllTasks,
} from "../controllers/task.Controllers.js";

import { verifyJWT } from "../middlewares/auth.Middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/add").post(addTask);
router.route("/update/:taskID").patch(updateTask);
router.route("/delete/:taskID").delete(deleteTask);
router.route("/description/:taskID").get(readTask);
router.route("/status/:taskID").patch(toggleTaskStatus);
router.route("/all").get(getAllTasks);

export default router;
