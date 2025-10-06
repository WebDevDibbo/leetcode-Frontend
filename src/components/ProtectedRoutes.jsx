import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function ProtectedRoutes({children}) {

  const { isAuthenticated,user,loading} = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(()=>{

    if(!isAuthenticated) navigate('/login');

  },[])

    return (
        children
    );
}

export default ProtectedRoutes;