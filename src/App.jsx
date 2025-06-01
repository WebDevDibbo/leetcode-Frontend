import {Routes, Route, Navigate} from "react-router";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from './authSlice';
import CodeEditor from "./pages/CodeEditor";
import { useState } from "react";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";

const cssloader = {
  display : "flex",
  justifyContent : "center",
  alignItem : "center",
  borderColor : "purple"
}


function App() {

  const dispatch = useDispatch();
  const {isAuthenticated,loading,user} = useSelector((state)=>state.auth);
  

  useEffect(()=>{

    dispatch(checkAuth());

  },[dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-dots loading-lg text-accent"></span>
    </div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Homepage/> : <Navigate to='/signup'/>}></Route>
        <Route path="/signup" element={isAuthenticated  ? <Navigate to='/'/> : <Signup/>}></Route>
        <Route path="/login" element={isAuthenticated ?  <Navigate to='/'/> : <Login/>}></Route>
        <Route path="/editor" element={<CodeEditor/>}/>
        <Route path="/admin" element = {<AdminPanel/>}/>
        <Route path="problem/:problemId" element = {<ProblemPage/>}/>
      </Routes>
    </>
  )
}

export default App
