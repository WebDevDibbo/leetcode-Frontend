import '../modalFix.css';
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
// import { logoutUser } from "../authSlice";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { ChevronLeft, ChevronsDown, ChevronsUp, CircleCheckBig, Funnel, Plus, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";



function Homepage() {

    const [expanded, setExpanded] = useState(false);
    const [searchProblem, setSearchProblem] = useState("");
    const [existingLists,setExistingLists] = useState([]);
    const [problems, setProblems] = useState([]);
    const [problemId,setProblemId] = useState("");
    const [loading,setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [createValue, setCreateValue] = useState("");
    const [playlistChecked, setPlaylistChecked] = useState(false);
    const [filters, setFilters] = useState({
      difficulty: "all",
      topic: "all",
      status: "all",
    });

  
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/api/problems");
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err.message);
      }
    };

    const getSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/api/problems/problemSolvedByUser"
        );
        console.log('solved',data);
        setSolvedProblems(data);
      } catch (err) {
        console.log("Error fetching solved problems", err.message);
      }
    };

    fetchProblems();
    if (user) getSolvedProblems();
  }, [user]);

  
  // useEffect(()=>{

  //   const fetchPlaylist = async() => {
      
  //     try {
  //       const { data } = await axiosClient.get("/api/playlists/");
  //       setPlaylists(data);

  //     } catch (err) {
  //       console.log("error", err.message);
  //     }

  //   }
  //   if(modalState === 'playlists')
  //       fetchPlaylist();

  // },[modalState]);

  const handleCreatePlaylist = async() => {

    // console.log('problemname',pb)
    // console.log('problemid',problemId);
    setLoading(true);
    // console.log('create',createValue)

    try{

        const res = await axiosClient.post("/api/playlists/",{ title : createValue, problemId : problemId});
        // console.log('res',res);
        setLoading(false);
        setCreateValue("");
        if(res?.status === 201)
        {
           toast.success(res?.data);
        }
    }
    catch(err)
    {
        console.log("error", err.message);
        setCreateValue("");
        setLoading(false);
    }

  }

  const handlePlaylist = async(probId) => {
    //console.log('pb',probId); // string
    
    setExistingLists([]);
      try {
        const { data } = await axiosClient.get("/api/playlists/");
        
        setProblemId(probId);
        data.forEach(list => {
        
        list.problems.find(pbId => probId === pbId) ?
        list.isPresent = true : list.isPresent = false
          
        });
        setPlaylists(data);

      } catch (err) {
        console.log("error", err.message);
      }
      document.getElementById("my_modal_1").showModal();
  }

  const handleDelete = async(playlistId,probId,title) => {
    console.log('playid',playlistId, 'problId',probId);

    try{
      const res = await axiosClient.delete(`/api/playlists/${playlistId}/problems/${probId}`);
      console.log(res);
      if(res?.status === 201)
      {
        // toast.success(res?.data?.message);
        toast.success(`Removed from ${title}`)
      }
    }
    catch(err){
      console.log('error',err.message);
    }

  }

  const handleCheckBoxChange = async(playlist) => {
    // console.log('checked',playlist);
    // console.log('checkpresent',playlist?.isPresent);
    // console.log('problemid',problemId);
    if(!playlist?.isPresent)
    {
        try{
          const res = await axiosClient.post(`/api/playlists/${playlist._id}`,{ problemId : problemId});
          // console.log(res);
          if(res?.status === 201)
          {
            toast.success(`Added to ${playlist?.title}`);
          }

        }
        catch(err){
          console.log('error',err.message);
        }
    }
    else{
      handleDelete(playlist._id,problemId,playlist.title);
    } 
    

  }
  // console.log('existinglist',existingLists);

  let filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  })
  
  filteredProblems = filteredProblems.filter((pb) => pb?.title.toLowerCase().includes(searchProblem))

  const tags = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth First Search",
    "Binary Search",
    "Tree",
    "Breadth First Search",
    "Bit Manipulation",
    "Two Pointers",
    "Prefix Sum",
    "Heap (Priority Queue)",
    "Binary Tree",
    "Stack",
    "Graph",
    "Sliding Window",
    "Design",
    "Backtracking",
    "Union Find",
    "Linked List",
    "Number Theory",
    "Ordered Set",
    "Monotonic Stack",
    "Segment Tree",
    "Trie",
    "Queue",
    "Recursion",
    "Divide and Conquer",
    "Binary Search Tree",
    "String Matching",
    "Topological Sort",
    "Shortest Path",

    "Monotonic Queue",
    "Brainteaser",
    "Doubly-Linked List",
    "Randomized",
    "Merge Sort",
    "Counting Sort",

    "Quickselect",

    "Line Sweep",
    "Bucket Sort",
    "Minimum Spanning Tree",
    "Strongly Connected Component",
    "Eulerian Circuit",
    "Radix Sort",
    "Biconnected Component",
  ];
  const visibleTags = expanded ? tags : tags.slice(0, 10);
  
  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-[#111111]">
        <div className="container mx-auto ">
          {/* Filters */}
          {/* accordian */}

          {/* accordian end*/}
          <h2 className="text-center text-4xl py-10 font-bold">
            Welcome to <span className="text-purple-500 ">Problem Sheet</span>
          </h2>
          <p className="text-xl font-semibold text-center mb-10 text-zinc-300">
            Every great programmer starts with a problem. These challenges are
            your stepping stones — each one builds your logic, sharpens your
            skills, and brings you closer to mastery.
          </p>
          <div className="mb-4">
            <div className="text-white grid grid-cols-4">
              <div className="flex col-span-3 cursor-pointer items-center flex-wrap gap-2 transition-all duration-400">
                {visibleTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 hover:text-blue-500 bg-zinc-800 rounded text-sm hover:bg-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="">
                {expanded == false ? (
                  <div
                    className="cursor-pointer w-fit rounded "
                    onClick={() => setExpanded(!expanded)}
                  >
                    <span className="bg-zinc-800  rounded flex text-sm gap-1 items-center py-1 px-2">
                      Expand <ChevronsDown size={18} />{" "}
                    </span>
                  </div>
                ) : (
                  <div
                    className=" cursor-pointer w-fit rounded "
                    onClick={() => setExpanded(!expanded)}
                  >
                    <span className="bg-zinc-800  rounded flex text-sm gap-1 items-center py-1 px-2">
                      Collapse <ChevronsUp size={18} />{" "}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex text-white flex-wrap gap-4 mb-6">
            <label className="input input-neutral focus:outline-none bg-zinc-800 focus:ring-0 focus:border-transparent">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                value={searchProblem}
                onChange={(e) => setSearchProblem(e.target.value)}
                type="text"
                required
                placeholder="Search"
              />
            </label>

            {/* New Status Filter */}
            <div className="relative">
              <select
                className="select text-white font-semibold  select-neutral bg-zinc-800 focus:outline-0 focus:ring-0 focus:border-transparent"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option className="font-semibold" value="all">
                  All Problems
                </option>
                <option className="font-semibold" value="solved">
                  Solved Problems
                </option>
              </select>
            </div>

            {/* difficulty filter */}
            <div className="relative text-white">
              <Funnel
                size={18}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-white pointer-events-none"
              />
              <select
                className="select select-neutral pl-10 font-semibold bg-zinc-800 focus:outline-0  focus:ring-0 focus:border-transparent"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
              >
                <option className="font-semibold" value="all">
                  All Difficulties
                </option>
                <option className="font-semibold" value="easy">
                  Easy
                </option>
                <option className="font-semibold" value="medium">
                  Medium
                </option>
                <option className="font-semibold" value="hard">
                  Hard
                </option>
              </select>
            </div>
          </div>

          {/* Problems List */}
          <div className="grid gap-4 ">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="p-6 rounded-xl cursor-pointer border transition delay-150 ease-in-out border-gray-800 bg-[#0f0d0d]" //hover:bg-[#292929]
                >
                  <div className="flex justify-between ">
                    <div>
                      <h2 className="flex">
                        {(solvedProblems.some(
                          (sp) => sp._id === problem._id
                        ) && (
                          <div className="text-green-500">
                            <CircleCheckBig />
                          </div>
                        )) || <div className="pl-1 invisible">he</div>}
                        <p className="font-semibold text-white ml-2">
                          {index + 1}.{" "}
                        </p>
                        <NavLink
                          to={`/problem/${problem._id}`}
                          className="font-semibold text-white pl-1"
                        >
                          {problem.title}
                        </NavLink>
                      </h2>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        className={`text-green-500 text-sm font-semibold bg-[#28a056]/20 px-2 p-1 rounded font-mono
                        ${getDifficultyBadgeColor(problem.difficulty)}`}
                      >
                        {problem.difficulty.slice(0, 1).toUpperCase()}
                        {problem.difficulty.slice(1, problem.difficulty.length)}
                      </div>
                      <span onClick={() => handlePlaylist(problem._id)}>
                        {" "}
                        {/*onClick={() => handlePlaylist(problem.title)} */}
                        <Star
                          className="text-[#ffb700] hover:bg-[#ada752]/20"
                          size={20}
                        />
                      </span>

                      {/* daisyui modal design */}

                      <dialog id="my_modal_1" className="modal blurfix">
                        <div className="modal-box w-60 h-[275px] overflow-y-auto px-0 py-0 border bg-[#323232] max-w-xs">
                          <h3 className="font-bold text-md pt-5 pl-4 text-white">
                            My Lists
                          </h3>
                          <ul className="mt-3 ">
                            {playlists.length > 0 &&
                              playlists?.map((playlist) => (
                                <li
                                  className="text-white pl-3 p-2 mb-2 hover:bg-[#FFFFFF14] capitalize flex items-center"
                                  key={playlist._id}
                                >
                                  <input  onChange={()=>handleCheckBoxChange(playlist)}  type="checkbox" checked={playlist?.isPresent}   className="mr-2 checkbox checked:bg-white checked:text-black checkbox-xs" />
                                  {playlist?.title}
                                </li>
                              ))}
                            <span className="pl-3">
                              {playlists.length === 0 && (
                                <span>No Playlist Found</span>
                              )}
                            </span>
                          </ul>
                          
                          <div className="flex flex-col mt-5">
                            <div
                            onClick={() =>
                              document.getElementById("my_modal_2").showModal()
                            }
                            className="flex gap-2 items-center mt-6 border-t p-3 hover:text-white hover:bg-[#686868]/50"
                          >
                            <Plus size={18} />{" "}
                            <span className=""> Create a New Playlist </span>{" "}
                          </div>
                          </div>
                          
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                      </dialog>

                      <dialog id="my_modal_2" className="modal blurfix">
                        <div className="modal-box w-60 h-[275px] overflow-y-auto px-0 py-0 border bg-[#323232] max-w-xs">
                          <h3 className="font-bold flex items-center gap-2 text-md pt-5 pl-4 text-white">
                            <span onClick={()=>handlePlaylist(problemId)}>
                              <ChevronLeft
                                size={18}
                                onClick={() =>{
                                  document.getElementById("my_modal_2").close()
                                  document.getElementById("my_modal_1").showModal()
                                }
                                }
                              />
                            </span>{" "}
                            <span>Create a new list</span>
                          </h3>
                          <ul className="mt-3 mb-4 mx-3">
                            <label className="label flex items-center py-2">
                              <input
                                value={createValue}
                                onChange={(e) => setCreateValue(e.target.value)}
                                type="text"
                                className="p-2 rounded w-full focus:outline-none bg-zinc-800 focus:ring-0 focus:border-transparent"
                                required
                                placeholder="Enter a list name"
                              />
                            </label>
                          </ul>
                          <div className="mx-3 mb-3 bg-[#898989] text-center rounded">
                            {!loading ? (
                              <button
                                disabled={createValue.length === 0 ? true : false}
                                onClick={() =>
                                  handleCreatePlaylist()
                                }
                                className="p-2 cursor-pointer font-bold  text-black"
                              >
                                Create
                              </button>
                            ) : (
                              <PulseLoader color="green" size={8} />
                            )}
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                          </form>
                      </dialog>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span>No data Found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
