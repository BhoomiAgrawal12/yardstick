"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Calendar, 
  CalendarDays, 
  ListTodo, 
  LogOut, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Pencil,
  X,
  Check
} from "lucide-react";
import "../app/globals.css"; // Import the global CSS file

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/actions");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const response = await fetch("/actions", {
        method: "POST",
        body: JSON.stringify({ title: newTask, dueDate: "2025-02-26" }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to add task");
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const response = await fetch("/actions", {
        method: "PUT",
        body: JSON.stringify({ id, completed }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch("/actions", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTask(task._id);
    setEditedTitle(task.title);
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch("/actions", {
        method: "PUT",
        body: JSON.stringify({ id, title: editedTitle }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, title: editedTitle } : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-info">
          <div className="avatar"></div>
          <div>
            <h2 className="user-name">Bhoomi</h2>
            <p className="user-email">bhoomiag@gmail.com</p>
          </div>
        </div>

        <input type="text" placeholder="Search" className="search-bar" />

        <nav className="nav-menu">
          <button><Sun size={20} /> My day</button>
          <button><Calendar size={20} /> This week</button>
          <button><CalendarDays size={20} /> This month</button>
          <button className="active"><ListTodo size={20} /> All tasks</button>
        </nav>

        <button className="logout"><LogOut size={20} /> Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="background-image"></div>

        <div className="content-overlay">
          <div className="header">
            <h1>All tasks</h1>
            <button><MoreVertical size={24} /></button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                <div className="task-info">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id, !task.completed)}
                  />
                  {editingTask === task._id ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className={task.completed ? "completed" : ""}>{task.title}</p>
                  )}
                </div>
                <div className="task-actions">
                  <span>{task.dueDate}</span>
                  {editingTask === task._id ? (
                    <>
                      <button onClick={() => saveEdit(task._id)}><Check size={18} /></button>
                      <button onClick={() => setEditingTask(null)}><X size={18} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(task)}><Pencil size={18} /></button>
                      <button onClick={() => deleteTask(task._id)}><Trash2 size={18} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Task Input */}
          <div className="add-task">
            <Plus size={20} />
            <input
              type="text"
              placeholder="Add a task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <input type="date" defaultValue="2025-02-26" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDashboard;

// "use client";

// import React, { useState, useEffect } from "react";
// import { 
//   Sun, 
//   Calendar, 
//   CalendarDays, 
//   ListTodo, 
//   LogOut, 
//   MoreVertical, 
//   Plus, 
//   Trash2, 
//   Pencil,
//   X,
//   Check
// } from "lucide-react";

// interface Task {
//   _id: string;
//   title: string;
//   dueDate: string;
//   completed: boolean;
// }

// function TaskDashboard() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTask, setNewTask] = useState("");
//   const [editingTask, setEditingTask] = useState<string | null>(null);
//   const [editedTitle, setEditedTitle] = useState("");

//   // Fetch tasks from API
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await fetch("/actions");
//         if (!res.ok) throw new Error("Failed to fetch tasks");
//         const data = await res.json();
//         setTasks(data);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   // Add new task
//   const addTask = async () => {
//     if (newTask.trim() === "") return;

//     try {
//       const response = await fetch("/actions", {
//         method: "POST",
//         body: JSON.stringify({ title: newTask, dueDate: "2025-02-26" }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error("Failed to add task");
//       const createdTask = await response.json();
//       setTasks((prevTasks) => [...prevTasks, createdTask]);
//       setNewTask("");
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   // Toggle Task Completion
//   const toggleTask = async (id: string, completed: boolean) => {
//     try {
//       const response = await fetch("/actions", {
//         method: "PUT",
//         body: JSON.stringify({ id, completed }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error("Failed to update task");

//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task._id === id ? { ...task, completed } : task
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling task:", error);
//     }
//   };

//   // Delete Task
//   const deleteTask = async (id: string) => {
//     try {
//       const response = await fetch("/actions", {
//         method: "DELETE",
//         body: JSON.stringify({ id }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error("Failed to delete task");

//       setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   // Start editing task
//   const startEditing = (task: Task) => {
//     setEditingTask(task._id);
//     setEditedTitle(task.title);
//   };

//   // Save edited task
//   const saveEdit = async (id: string) => {
//     try {
//       const response = await fetch("/actions", {
//         method: "PUT",
//         body: JSON.stringify({ id, title: editedTitle }),
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error("Failed to update task");

//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task._id === id ? { ...task, title: editedTitle } : task
//         )
//       );
//       setEditingTask(null);
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-red-500 overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-64 bg-white p-6 shadow-lg">
//         <div className="flex items-center space-x-3 mb-8">
//           <div className="w-10 h-10 rounded-full bg-gray-200"></div>
//           <div>
//             <h2 className="font-semibold">Bhoomi</h2>
//             <p className="text-sm text-gray-500">bhoomiag@gmail.com</p>
//           </div>
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full bg-gray-100 rounded-lg py-2 px-4 focus:outline-none"
//           />
//         </div>

//         <nav className="mt-8 space-y-4">
//           <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 w-full">
//             <Sun size={20} />
//             <span>My day</span>
//           </button>
//           <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 w-full">
//             <Calendar size={20} />
//             <span>This week</span>
//           </button>
//           <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 w-full">
//             <CalendarDays size={20} />
//             <span>This month</span>
//           </button>
//           <button className="flex items-center space-x-3 text-blue-600 w-full">
//             <ListTodo size={20} />
//             <span>All tasks</span>
//           </button>
//         </nav>

//         <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 w-full mt-auto absolute bottom-6">
//           <LogOut size={20} />
//           <span>Logout</span>
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 relative">
//         {/* Background Image */}
//         {/* <div 
//           className="absolute inset-0 bg-cover bg-center z-0"
//           style={{
//             backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80')"
//           }}
//         />
//          */}
//          <div 
//   className="absolute inset-0  bg-cover bg-center z-0"
//   style={{
//     backgroundImage: "url('/background.jpg')", // Path relative to the public folder
//         backgroundSize: 'cover', // To make the image cover the entire div
//         backgroundPosition: 'center', // To center the image in the div
//         height: '100vh', // To take up the full height of the viewport
//   }}
// />

//         {/* Content Overlay */}
//         <div className="relative z-10 h-full backdrop-blur-sm bg-white/30">
//           <div className="p-8">
//             <div className="flex justify-between items-center mb-8">
//               <h1 className="text-3xl font-bold text-white">All tasks</h1>
//               <button className="text-white">
//                 <MoreVertical size={24} />
//               </button>
//             </div>

//             <div className="space-y-3">
//               {tasks.map((task) => (
//                 <div
//                   key={task._id}
//                   className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-lg shadow-sm"
//                 >
//                   <div className="flex items-center space-x-3 flex-1">
//                     <input
//                       type="checkbox"
//                       checked={task.completed}
//                       onChange={() => toggleTask(task._id, !task.completed)}
//                       className="w-5 h-5 rounded-full border-2 border-gray-300"
//                     />
//                     {editingTask === task._id ? (
//                       <input
//                         type="text"
//                         value={editedTitle}
//                         onChange={(e) => setEditedTitle(e.target.value)}
//                         className="flex-1 bg-transparent border-b border-gray-400 focus:outline-none"
//                         autoFocus
//                       />
//                     ) : (
//                       <p className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""}`}>
//                         {task.title}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm text-gray-500">{task.dueDate}</span>
//                     {editingTask === task._id ? (
//                       <>
//                         <button onClick={() => saveEdit(task._id)} className="text-green-600">
//                           <Check size={18} />
//                         </button>
//                         <button onClick={() => setEditingTask(null)} className="text-gray-600">
//                           <X size={18} />
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button onClick={() => startEditing(task)} className="text-gray-600 hover:text-blue-600">
//                           <Pencil size={18} />
//                         </button>
//                         <button onClick={() => deleteTask(task._id)} className="text-gray-600 hover:text-red-600">
//                           <Trash2 size={18} />
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Add Task Input */}
//           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 max-w-3xl">
//             <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
//               <Plus size={20} className="text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Add a task"
//                 className="flex-1 bg-transparent border-none outline-none"
//                 value={newTask}
//                 onChange={(e) => setNewTask(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && addTask()}
//               />
//               <input
//                 type="date"
//                 className="bg-transparent border-none outline-none text-gray-500"
//                 defaultValue="2025-02-26"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskDashboard;