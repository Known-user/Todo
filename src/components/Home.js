import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index.js";
import axios from "axios";
import { server } from "../index";
import toast from "react-hot-toast";
import { GrDocumentVerified ,GrDocumentMissing  } from "react-icons/gr";
import { IoMdArrowDropdownCircle ,IoMdArrowDropupCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Navigate } from "react-router-dom";

export default function Home() {
  const {
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    user,
    setUser,
  } = useContext(Context);
  const [addTask, setAddTask] = useState(false);
  const [myTask, setMyTask] = useState([]);
  const [task, setTask] = useState("");
  const [title, setTitle] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [filter, setFilter] = useState("all");

  const addTasksHandler = async () => {
    try {
      const data = await axios.post(
        `${server}/task/new`,
        {
          title: title,
          description: task,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.data.message);
      setAddTask(!addTask);
      setTitle("");
      setTask("");
      TasksHandler();
    } catch (error) {
      toast.error(error.response.data.message);
      setAddTask(!addTask);
    }
  };

  const TasksHandler = async () => {
    try {
      const data = await axios.get(`${server}/task/my`, {
        withCredentials: true,
      });
      setMyTask(data.data.tasks);
    } catch (error) {
      // setUser({});
      console.log("Error");
    }
  };

  const deleteTask = async (id) => {
    try {
      const data = await axios.delete(`${server}/task/${id}`, {
        withCredentials: true,
      });
      toast.success(data.data.message);
      TasksHandler();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const editTaskHandler = async (id) => {
    try {
      const data = await axios.put(
        `${server}/task/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.data.message);
      setEditTaskId(null);
      TasksHandler();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const clearIncompleteTasksHandler = async () => {
    console.log("clear")
    const incompleteTasks = myTask.filter(task => !task.isCompleted);
    for (const task of incompleteTasks) {
      await editTaskHandler(task._id);
    }
  };

  useEffect(()=>{
    const myProfile=async()=>{
      try {
        const data = await axios.get(
          `${server}/user/myprofile`,
          {
          withCredentials: true,
        })
        // console.log(data.data.user)
        setUser(data.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setUser({});
        setIsAuthenticated(false);
      }
    }
    myProfile();
    TasksHandler();
  },[])

  const filteredTasks = myTask.filter(task => {
    if (filter === "all") return true;
    if (filter === "done") return task.isCompleted;
    if (filter === "todo") return !task.isCompleted;
    return true;
  });

  const incompleteTasksCount = myTask.filter(task => !task.isCompleted).length;

  if (!isAuthenticated) return <Navigate to={"/login"} />

  return (
    <>
      {console.log("Authenticate "+isAuthenticated)}
      <div
        className="flex justify-center min-h-screen bg-gradient-to-r from-blue-500 to-pink-500 p-10"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        <div className="container flex flex-col bg-black bg-opacity-50 rounded-2xl shadow-lg p-6 w-full max-w-8xl mx-auto min-h-[500px] h-fit">
          {/* Dots */}
          <div className="flex justify-end mb-4">
            <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
            <div className="h-4 w-4 bg-yellow-500 rounded-full mr-2"></div>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </div>

          {/* Greeting */}
          <div className="text-center mb-6">
            <h2 className="text-white text-4xl capitalize">
              Hello, {user.name}
            </h2>
          </div>

          {/* Incomplete Task Info */}
          <div className="flex justify-center mb-6">
              {incompleteTasksCount===0 ? (
                <p className="text-white text-xl">
                You have {incompleteTasksCount}{" "}
                <span className="text-yellow-500">Incomplete</span> Tasks :)
              </p>
              ) : (
                <p className="text-white text-xl">
              You have {incompleteTasksCount}{" "}
              <span className="text-yellow-500">Incomplete</span> Tasks :(
            </p>
          )}
            
          </div>

          <header className="flex gap-2 w-full items-center mb-4">
            <h2 className="text-2xl text-white mr-auto">Tasks</h2>
            <label className="text-gray-100 uppercase text-lg" htmlFor="filters">
              View
            </label>
            <div className="bg-gray-900 rounded px-1">
              <select
                id="filters"
                name="filters"
                className="bg-transparent text-white p-2"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all" className="bg-transparent text-black">
                  All
                </option>
                <option value="done" className="bg-transparent text-black ">
                  Completed
                </option>
                <option value="todo" className="bg-transparent text-black">
                  Incomplete
                </option>
              </select>
            </div>
          </header>

          {/* Task List */}
          <div className="mb-6">
            {filteredTasks.length > 0 &&
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-4"
                >
                  <>
                    <div className="flex justify-between items-center text-white ">
                      <p
                        className={`font-light ${
                          task.isCompleted && "line-through text-gray-500"
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex">
                        <button
                          onClick={() => editTaskHandler(task._id)}
                          className="text-blue-400 text-2xl mr-4"
                        >
                          {task.isCompleted ? <GrDocumentVerified /> : <GrDocumentMissing />}
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-500 text-2xl mr-3"
                        >
                          <MdDelete />
                        </button>
                        <button
                          onClick={() =>
                            setExpandedTaskId(
                              expandedTaskId === task._id ? null : task._id
                            )
                          }
                          className="bg-red-500 text-2xl rounded-full w-[23px] h-[23px] mt-[6px] flex justify-center items-center text-[#442A46]"
                        >
                          {expandedTaskId === task._id ? (
                            <IoMdArrowDropupCircle  />
                          ) : (
                            <IoMdArrowDropdownCircle />
                          )}
                        </button>
                      </div>
                    </div>
                    {expandedTaskId === task._id && (
                      <p className="text-gray-300 mt-2">{task.description}</p>
                    )}
                  </>
                </div>
              ))}
          </div>

          {/* Add Task Button */}
          <div className="flex justify-between">
            <button onClick={clearIncompleteTasksHandler} className="flex items-center bg-gray-900 text-white rounded px-5 py-2">
                Clear All Incomplete Tasks
            </button>
            <button
              onClick={() => setAddTask(!addTask)}
              className="bg-gray-900 bg-opacity-95 text-white px-4 py-2 rounded shadow-lg"
            >
              Add Task
            </button>
          </div>
        </div>

        <div
          className={`${
            !addTask && "hidden"
          } bg-black bg-opacity-70 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full`}
        >
          <div className="flex bg-black bg-opacity-95 flex-nowrap items-center rounded-md w-3/4 ">
            <div className="w-full p-4">
              <div className="flex flex-nowrap items-baseline justify-between w-full p-2">
                <input
                  type="text"
                  placeholder="Add Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold text-white bg-transparent border-b border-gray-600 focus:border-gray-300 w-full p-2 mb-4 outline-none"
                />
                <span
                  onClick={() => setAddTask(!addTask)}
                  className="text-right cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    viewBox="0 0 384 512"
                    className="fill-current text-gray-200 transition ease-in-out duration-200 hover:text-gray-400"
                  >
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                  </svg>
                </span>
              </div>
              <textarea
                className="text-sm text-gray-200 bg-transparent border border-gray-600 focus:border-gray-300 p-2 w-full h-40 rounded-md outline-none"
                placeholder="Type here..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <div className="w-full flex justify-end p-2">
                <button
                  onClick={addTasksHandler}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}








