import { Link, NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";


function Homepage(){


      const [problems, setProblems] = useState([]);
      const dispatch = useDispatch();
      const {isAuthenticated, user } = useSelector((state) => state.auth);
      const [filters, setFilters] = useState({
        difficulty : "all",
        topic : "all",
        status : "all",
      })

      const handleLogOut = () => {

        dispatch(logoutUser());
      }


      useEffect(()=>{

        const fetchProblems = async() => {

          try{

            const {data} = await axiosClient.get('/api/problems');
            setProblems(data);

          }catch(err){
            console.log('Error fetching problems:', err);
          }

        }
        fetchProblems();

      },[])

      const filteredProblems = problems.filter(problem => {

          const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
          const topicMatch = filters.topic === 'all' || problem.topic === filters.topic;
          


      })



    return (
        <>
          <div className="min-h-screen bg-base-200">
            {/* Navigation Bar */}
            <nav className="navbar bg-base-100 shadow-lg px-4">
              <div className="flex-1">
                <Link to="/" className="btn text-white btn-ghost text-xl">LeetCode</Link>
              </div>
              <div className="flex-none gap-4">
                  {isAuthenticated && user?.role === 'admin' && (<button className="btn mr-2"><NavLink to='/admin'>Admin</NavLink></button>)}
                <div className="dropdown dropdown-end">
                    
                  <div tabIndex={0} className="btn btn-ghost">
                    {user?.firstName}
                  </div>
                  <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li className="mb-2"><button className="p-2" onClick={handleLogOut}>Logout</button></li>
                  </ul>

                </div>
              </div>
            </nav>

            <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* New Status Filter */}
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.topic}
            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <div key={problem._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="hover:text-primary"
                    >
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some((sp) => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div
                    className={`badge ${getDifficultyBadgeColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info">{problem.tags}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      </>
    )
}

export default Homepage;