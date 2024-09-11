import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    taskOwnerID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    taskDescription: {
      type: String,
      required: true,
      index: true,
      trim: true,
      minlength: 1,
    },
    taskStatus: {
      type: Boolean,
      required: true,
      default: false,
    },
    taskPriority: {
      type: String,
      enum: ["do", "decide", "delegate", "delete"],
      default: "do",
      required: true,
    },
    taskDeadline: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= Date.now();
        },
        message: "Deadline must be a future date.",
      },
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
