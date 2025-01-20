import Navbar from "./components/Navbar.js";
import Home from "./components/Home.js";
import Login from "./components/Signin.js";
import Register from "./components/Signup.js";
import Profile from "./components/Profile.js";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Context } from "./index.js";
import { useContext, useEffect } from "react";
import axios from "axios";
import { server } from "./index";

function App() {
  const {isAuthenticated,setIsAuthenticated,loading,setLoading,user,setUser} = useContext(Context);
  // const [profile,setProfile]= useState("");


  
 
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Toaster/>
      </Router>
    </>
  );
}

export default App;
