import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router';
import { logoutUser } from '../authSlice';
import { ListTree, LogOut, User } from 'lucide-react';

function Navbar() {


    const dispatch = useDispatch();
   const {isAuthenticated,loading,user} =  useSelector((state)=> state.auth);

   const handleLogOut = () => {

        dispatch(logoutUser());
    }

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar  bg-neutral-900 shadow-lg px-14">
              <div className="flex-1">
                <Link to="/" className=" text-white font-semibold btn-ghost text-xl">CodeStorm</Link>
                
              </div>
              <div>

              </div>
              <div className="flex-none gap-4">
                  {isAuthenticated && user?.role === 'admin' && (<button className="btn mr-2"><NavLink to='/admin'>Admin</NavLink></button>)}
                <div className="dropdown dropdown-end">
                    
                  <div tabIndex={0} className="btn btn-ghost">
                    {user?.firstName.slice(0,1).toUpperCase()}{user?.firstName.slice(1,user?.firstName.length)}
                  </div>
                  <ul tabIndex={0} className="mt-5 p-2 bg-zinc-900 shadow menu menu-sm dropdown-content border  rounded-box w-52">
                    <li className="mb-2 text-white hover:bg-gray-200 hover:text-black"> <button className="p-2 text-md font-semibold text-white hover:text-black"> <User size={20} /> Profile</button></li>
                    <li className="mb-2 text-white hover:bg-gray-200 hover:text-black"> <button className="p-2 text-md font-semibold text-white hover:text-black"> <ListTree size={20} /> My Lists</button></li>
                    <li className="mb-2 text-white hover:bg-gray-200 hover:text-black"> <button className="p-2 text-md font-semibold text-white hover:text-black" onClick={handleLogOut}> <LogOut size={20} /> Logout</button></li>
                  </ul>

                </div>
              </div>
            </nav>
        </div>
    );
}

export default Navbar;