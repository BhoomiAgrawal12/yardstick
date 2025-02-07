// "use server";

// import connectDB from "@/lib/db";
// import Task from "@/lib/models/task";
// import { ITask } from "@/lib/models/task";

// export async function getTasks(): Promise<ITask[]> {
//     await connectDB();
//     const tasks = await Task.find().sort({ dueDate: 1 });
  
//     // Convert Mongoose Documents into plain objects
//     return tasks.map((task) => ({
//       _id: task._id.toString(), // Convert ObjectId to string
//       title: task.title,
//       description: task.description,
//       dueDate: task.dueDate.toISOString(), // Convert Date to string
//       completed: task.completed,
//     }));
//   }


// export async function createTask(formData: FormData): Promise<void> {
//   await connectDB();
//   const taskData = {
//     title: formData.get("title") as string,
//     description: formData.get("description") as string,
//     dueDate: new Date(formData.get("dueDate") as string),
//     completed: false,
//   };
//   await Task.create(taskData);
// }

// export async function updateTask(id: string, formData: FormData): Promise<void> {
//   await connectDB();
//   const updatedTask = {
//     title: formData.get("title") as string,
//     description: formData.get("description") as string,
//     dueDate: new Date(formData.get("dueDate") as string),
//     completed: formData.get("completed") === "true",
//   };
//   await Task.findByIdAndUpdate(id, updatedTask);
// }

// export async function deleteTask(id: string): Promise<void> {
//   await connectDB();
//   await Task.findByIdAndDelete(id);
// }

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/lib/models/task";

// 🟢 GET All Tasks
export async function GET() {
  await dbConnect();
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}

// 🔵 CREATE Task
export async function POST(req: NextRequest) {
  await dbConnect();
  const { title, description, dueDate } = await req.json();

  if (!title || !dueDate) {
    return NextResponse.json({ error: "Title and due date are required" }, { status: 400 });
  }

  const newTask = new Task({ title, description, dueDate, completed: false });
  await newTask.save();
  return NextResponse.json(newTask);
}

// 🟡 UPDATE Task (Mark as Complete/Incomplete)
export async function PUT(req: NextRequest) {
  await dbConnect();
  const { id, completed } = await req.json();

  const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json(updatedTask);
}

// 🔴 DELETE Task
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { id } = await req.json();
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted" });
}
