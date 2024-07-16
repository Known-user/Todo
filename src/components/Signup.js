import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import {server} from "../index";
import { Context } from "..";

export default function Register() {
  const [viewpass, setviewpass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {isAuthenticated,setIsAuthenticated,loading,setLoading} = useContext(Context);

  const submitHandler=async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const data = await axios.post(
        `${server}/user/register`,
        {
          name,email,password
        },
        {
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials: true,
      })
      toast.success(data.data.message);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
      setIsAuthenticated(false);
      setLoading(false);
    }
  }


  if (isAuthenticated) return <Navigate to={"/"} />
  


  
  return (
    <>
      <div className="h-[93vh] w-full p-6 max-md:p-0">
        <div className="min-h-full w-full flex items-center justify-center bg-gradient-to-r rounded-[30%_12px_30%_12px] max-md:rounded-none from-purple-500 via-pink-500 to-orange-500 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
              Sign up to your account
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              Greetings on your return! We kindly request you to enter your
              details.
            </p>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-lg text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="text"
                  required
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  placeholder="Stefano Bojarski"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                required
                  className="w-full px-4 py-2 border rounded-lg text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="pat@saturn.dev"
                />
              </div>
              <div className="mb-4 relative">
                <label
                  className="block text-zinc-700 dark:text-zinc-300 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                  required
                    className="w-full px-4 py-2 border rounded-lg text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    type={`${viewpass? "text": "password"}`}
                    value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                    placeholder="min 8 cars"
                  />
                  <button
                  onClick={()=>setviewpass(!viewpass)}
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 py-2 text-zinc-600 dark:text-zinc-300"
                  >
                    {viewpass? 
                    <AiOutlineEye />
                    :
                    <AiOutlineEyeInvisible /> 
                    }
                  </button>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  id="remember-me"
                />
                <label
                  className="text-zinc-700 dark:text-zinc-300"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4">
                Login
              </button>
              <p className="text-center text-zinc-600 dark:text-zinc-400">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-500 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
