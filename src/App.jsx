import {Routes, Route, Navigate} from "react-router";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from './authSlice';
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Modalbox from "./pages/modalbox";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import AdminVideo from "./components/AdminVideo";







function App() {

  const dispatch = useDispatch();
  const {isAuthenticated,loading,user,error} = useSelector((state)=>state.auth);
  
  
  useEffect(()=>{

    dispatch(checkAuth());

  },[dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-ring w-20 text-success"></span>
    </div>;
  }

  return (
    <div>
      <Routes>
        {/* <Route path="/" element = {<Homepage/>}/> */}
        <Route path="/" element={<ProtectedRoutes><Homepage/></ProtectedRoutes>}></Route>
        <Route path="/signup" element={isAuthenticated  ? <Navigate to='/'/> : <Signup/>}></Route>
        <Route path="/login" element={isAuthenticated ?  <Navigate to='/'/> : <Login/>}></Route>
        <Route path="/admin" element = {isAuthenticated && user?.role === "admin"? <Admin/> : <Navigate to='/'/>}/>
        <Route path="/admin/create" element = {isAuthenticated && user?.role === "admin"? <AdminPanel/> : <Navigate to='/'/>}/>
        <Route path="/admin/delete" element = {isAuthenticated && user?.role === "admin"? <AdminDelete/> : <Navigate to='/'/>}/>
        <Route path="/admin/video" element = {isAuthenticated && user?.role === "admin"? <AdminVideo/> : <Navigate to='/'/>}/>
        <Route path="/admin/upload/:problemId" element = {isAuthenticated && user?.role === "admin"? <AdminUpload/> : <Navigate to='/'/>}/>
        <Route path="/problem/:problemId" element = {<ProblemPage/>}/>
        {/* <Route path="/modalbox" element={<Modalbox/>}/> */}
      
      </Routes>
    </div>
  )
}

export default App
