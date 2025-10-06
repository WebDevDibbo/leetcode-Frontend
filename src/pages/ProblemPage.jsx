import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Editor } from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { Terminal,SquareCheck, Check, X, BookOpen, ReceiptText, ClockArrowUp, FlaskConical, Send, ThumbsUp, CircleCheckBig } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import SubmissionHistory from '../components/SubmissionHistory';
import Navbar from '../components/Navbar';
import {ClipLoader, PulseLoader} from 'react-spinners';
import { GripHorizontal, GripVertical, Brain } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import '../problem.css'
import { addMessage, discussAI } from '../aiSlice';
import { setLanguageCode } from '../codeSlice';
import Editorial from '../components/Editorial';


function ProblemPage({solved}) {
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {messages} = useSelector((state)=> state.chat);  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [like, setLike] = useState(false);
  const [likesLength, setLikesLength] = useState(0);
  const [solvedProblems,setSolvedProblems] = useState([]);
  const [solvedMark,setSolvedMark] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [activeRightBottom, setActiveRightBottom] = useState('testcase');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  const { register, handleSubmit, reset,formState: {errors} } = useForm();
  const messagesEndRef = useRef(null);

  const onSubmit = async (data) => {
        // console.log(data)
        const userMessage = {role : 'user', parts : [{text : data.message}]};
        dispatch(addMessage(userMessage));
        dispatch(discussAI(
          {
            messages:data.message,
            title : problem.title,
            description : problem.description,
            testCases : problem.visibleTestCases,
            starterCode : problem.starterCode
          }
        ));
        reset();
    };
  
  const item = localStorage.getItem(selectedLanguage);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`api/problems/${problemId}`);
        console.log('problem',response)
        const initialCode = response.data.starterCode.find((sc) => {
          
          if (sc.language == "C++" && selectedLanguage == 'cpp')
            return true;
          else if (sc.language == "Java" && selectedLanguage == 'java')
            return true;
          else if (sc.language == "Javascript" && selectedLanguage == 'javascript')
            return true;
          
          return false;
        })?.initialCode || '';
        setProblem(response.data);
        setLikesLength(response?.data?.likes?.length);

        const userId = response?.data?.userId;        
        const isExist = response?.data?.likes?.find(like => like === userId);
        if(isExist) setLike(true);
        
        if(item)
        {
          console.log('items present',item);
          setCode(item);
          console.log(code)
          console.log('use1')
        }
        else 
        {
          console.log('unable')
          setCode(initialCode);
        }
        setLoading(false);
        
      } catch (error) {
        console.log('Error fetching problem:', error);
        if(error.status === 401) navigate('/login');
        setLoading(false);
      }
    };


    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      for(let x of problem.starterCode)
      {
        if(x.language === 'C++') x.language = 'cpp';
      }
      const defaultStarterCode = problem.starterCode.find(sc => sc.language.toLowerCase() === selectedLanguage)?.initialCode || '';
      if(item)
        {
          setCode(item);
        }
        else
        {
          localStorage.setItem(selectedLanguage,defaultStarterCode);
          setCode(defaultStarterCode)
        }
        
     
    }

    const getSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/api/problems/problemSolvedByUser"
        );
        setSolvedProblems(data);
      } catch (err) {
        console.log("Error fetching solved problems", err.message);
      }
    };
    if(user) getSolvedProblems();
    if(solvedProblems.find(pb => pb._id === problem._id)) setSolvedMark(true);
  }, [selectedLanguage, problem]);

  useEffect(()=>{

    if(item)
    {
     localStorage.setItem(selectedLanguage,code);
    }
    console.log('use3')

  },[code])

  
  const handleEditorChange = (value) => {
    setCode(value || '');
    
  };


  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
  };


  // const handleLanguageChange = (language) => {
  //   setSelectedLanguage(language);
  // };
  // solvedProblems.find(pb => pb._id === problem._id)
  console.log('problems',problem);
  console.log('solved', solvedProblems);
  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    setActiveRightBottom("result");
    
    try {
      const response = await axiosClient.post(`/api/submission/run/${problemId}`, {
        code : code,
        language: selectedLanguage
      });
      setRunResult(response.data);
      setLoading(false);
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
   
    try {
        const response = await axiosClient.post(`/api/submission/submit/${problemId}`, {
        code:code,
        language: selectedLanguage
      });
      console.log('submit-data',response.data)
       setSubmitResult(response.data);
       setLoading(false);
       setActiveLeftTab("submissions");
      
    } catch (error) {
      console.log('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveLeftTab("submissions");
      
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleLike = async () => {

    if(!like)
    {
      setLike(true);
      try {
        const {data} = await axiosClient.patch(`/api/problems/${problemId}/like`);
        setLikesLength(data.likes);
      } catch (err) {
        console.log("error", err.message);
      } 
    }
    else
    {
      setLike(false);
      try {
        const {data} = await axiosClient.patch(`/api/problems/${problemId}/unlike`);
        setLikesLength(data?.likes);
      } catch (err) {
        console.log("error", err.message);
      } 

    }
   
    
      
  }

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-ring text-success w-20"></span>
      </div>
    );
  }

  if(!isAuthenticated) navigate('/login')
  
  

return (
  <div>
    <Navbar />
    <div className="absolute  top-9 left-1/2  -translate-x-1/2 -translate-y-1/2">
      <button
        className={`btn bg-zinc-800 hover:bg-zinc-700 btn-sm `}
        onClick={handleRun}
      >
        {loading === false && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {loading ? <PulseLoader color="green" size={8} /> : <span>Run</span>}
        {loading === true && <span>Pending...</span>}
      </button>

      {loading === false && (
        <button
          className={`btn  text-[#28AE37]  bg-[#262626]  hover:bg-[#353434]  btn-sm `}
          onClick={handleSubmitCode}
        >
          {
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          }
          Submit
        </button>
      )}
    </div>
    <div className="h-[calc(100vh-65px)] flex flex-col custom-scroll pb-2 bg-[#18181B]">
      <PanelGroup direction="horizontal">
        <Panel
          className="shadow-lg h-full  overflow-auto mr-1"
          defaultSize={50}
          minSize={35}
        >
          {/* Left Panel */}
          <div className="h-full overflow-auto custom-scroll relative ">
            {/* Left Tabs */}
            <div className="flex sticky left-0 top-0 z-50 right-0 flex-nowrap py-2 bg-[#353538] px-4">
              <button
                className={`tab  hover:text-[#f5b210] py-2 ${
                  activeLeftTab === "description"
                    ? "tab-active bg-zinc-800 text-[#f5b210]"
                    : "text-white"
                }  flex flex-nowrap gap-1 justify-center items-center`}
                onClick={() => setActiveLeftTab("description")}
              >
                <ReceiptText className="h-4 w-4" />

                <div className="text-sm font-semibold">Description</div>
              </button>
              <button
                className={`tab hover:text-[#f5b210] py-2 ${
                  activeLeftTab === "editorial"
                    ? "tab-active bg-zinc-800 text-[#f5b210]"
                    : ""
                }   flex flex-nowrap gap-1 justify-center items-center`}
                onClick={() => setActiveLeftTab("editorial")}
              >
                <BookOpen className="h-4 w-4" />

                <div className="text-md font-semibold">Editorial</div>
              </button>
              <button
                className={`tab hover:text-[#f5b210] py-2 ${
                  activeLeftTab === "solutions"
                    ? "tab-active bg-zinc-800 text-[#f5b210]"
                    : ""
                } flex flex-nowrap gap-1 justify-center items-center`}
                onClick={() => setActiveLeftTab("solutions")}
              >
                <FlaskConical className="w-4 h-4" />
                <div className="text-md font-semibold">Solutions</div>
              </button>
              <button
                className={`tab hover:text-[#f5b210] py-2 ${
                  activeLeftTab === "submissions"
                    ? "tab-active bg-zinc-800 text-[#f5b210]"
                    : ""
                } flex flex-nowrap gap-1 justify-center items-center`}
                onClick={() => setActiveLeftTab("submissions")}
              >
                <ClockArrowUp className="h-4 w-4" />
                <div className="text-sm font-semibold">Submissions</div>
              </button>
              <button
                className={`tab hover:text-[#f5b210] ${
                  activeLeftTab === "ChatAi"
                    ? "tab-active text-[#f5b210] bg-zinc-800"
                    : ""
                } flex gap-1 flex-nowrap justify-center items-center`}
                onClick={() => setActiveLeftTab("ChatAi")}
              >
                <Brain className="h-4 w-4" />
                <div className="text-sm font-semibold">ChatAi</div>
              </button>
            </div>
            {/* Left Content */}
            <div className="bg-[#262626] relative translate-z-0.5 custom-scroll w-[100%] h-full overflow-auto pb-16 px-6 pt-6">
              {problem && (
                <>
                  {activeLeftTab === "description" && (
                    <div>
                      <div className="flex  items-center  gap-4 mb-6">
                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                        <div
                          className={`bg-green-700 text-white px-2 rounded ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty.charAt(0).toUpperCase() +
                            problem.difficulty.slice(1)}
                        </div>
                        <div className="bg-indigo-600 rounded px-2">
                          {problem.topics}
                        </div>
                        <div className="text-green-500 absolute right-8">
                          {solvedMark && <CircleCheckBig />}
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-md leading-relaxed">
                          {problem.description}
                        </div>
                      </div>

                      <div className="mt-8">
                        {/* <h3 className="text-lg font-semibold mb-4">Examples:</h3> */}
                        <div className="space-y-4">
                          {problem.visibleTestCases.map((example, index) => (
                            <div
                              key={index}
                              className="bg-[#1F1F22] p-4 rounded-lg"
                            >
                              <h4 className="font-semibold mb-2">
                                Example {index + 1}:
                              </h4>
                              <div className="space-y-2 text-sm font-mono">
                                <div>
                                  <strong>Input:</strong> {example.input}
                                </div>
                                <div>
                                  <strong>Output:</strong> {example.output}
                                </div>
                                <div>
                                  <strong>Explanation:</strong>{" "}
                                  {example.explanation}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLeftTab === "editorial" && (
                    <div className="prose h-full  custom-scroll max-w-none">
                      <div className="whitespace-pre-wrap  flex flex-col justify-center text-sm leading-relaxed">
                        {problem?.secureUrl ? <div>
                          <div className="w-full">
                          <h2 className="text-xl font-semibold mt-3">
                            {problem.title}
                          </h2>
                          <h3 className="text-xl font-semibold mt-8">
                            Video Solution
                          </h3>
                          <div className="h-1 w-full max-w-2xl overflow-hidden mb-4 mt-4 bg-indigo-900"></div>
                        </div>

                        <div>
                          <Editorial
                            secureUrl={problem.secureUrl}
                            duration={problem.duration}
                            thumbnailUrl={problem.thumbnailUrl}
                            cloudName={problem.cloud_name}
                            publicId = {problem.public_id}
                          />
                        </div>
                        </div> : <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>No Editorial Available</div>}
                      </div>
                    </div>
                  )}

                  {activeLeftTab === "solutions" && (
                    <div className=" ">
                      <h2 className="text-xl font-bold mb-4">Solutions</h2>
                      <div className="space-y-6">
                        {problem.referenceSolution?.map((solution, index) => (
                          <div
                            key={index}
                            className="border border-base-300 rounded-lg"
                          >
                            <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                              <h3 className="font-semibold">
                                {problem?.title} - {solution?.language}
                              </h3>
                            </div>
                            <div className="p-4">
                              <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                                <code>{solution?.completeCode}</code>
                              </pre>
                            </div>
                          </div>
                        )) || (
                          <p className="text-gray-500">
                            Solutions will be available after you solve the
                            problem.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLeftTab === "submissions" && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-gray-500">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  )}

                  {activeLeftTab === "ChatAi" && (
                    <div className=" h-full  custom-scroll overflow-auto">
                      <div
                        style={{ height: "inherit" }}
                        className="flex-1 space-y-4 mb-8 flex-col bg-neutral-800"
                      >
                        {/* Chat Box */}
                        <div className="flex-1 overflow-y-auto custom-scroll space-y-2 mb-4 pb-3 flex flex-col">
                          {messages?.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${
                                msg.role === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-xs my-2 py-2 px-6 rounded-lg ${
                                  msg.role === "user"
                                    ? "bg-[#f5b210] text-black font-mono"
                                    : "bg-zinc-900 drop-shadow-xl/50  text-white"
                                }`}
                              >
                                {msg.parts[0].text}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Input Field */}
                      </div>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex sticky bottom-0 bg-neutral-700 z-50 left-0  gap-3 flex-nowrap p-3 "
                      >
                        <input
                          type="text"
                          {...register("message", {
                            required: true,
                            minLength: 2,
                          })}
                          className="flex-1 border border-gray-400 rounded-l px-4 py-2 focus:outline-none"
                          placeholder="Disscuss your current problem with AI Assistant"
                        />
                        <button
                          type="submit"
                          disabled={errors.message}
                          className="cursor-pointer px-4 py-2 rounded-r bg-[#f5b210] flex items-center"
                        >
                          <Send size={20} className="text-neutral-600" />
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
            {/*like button */}{" "}
            {activeLeftTab === "description" && (
              <div className="sticky  bg-[#262626] py-2 pl-6 bottom-0">
                <span
                  className="pl-2 cursor-pointer hover:bg-zinc-500 gap-x-1.5 bg-zinc-600 flex items-center w-14 rounded"
                  onClick={() => handleLike()}
                >
                  <ThumbsUp
                    size={16}
                    className={` ${like && "text-green-500"}`}
                  />
                  <span>{likesLength}</span>
                </span>
              </div>
            )}
          </div>
        </Panel>

        <div className="relative mx-1">
          <PanelResizeHandle className=" w-0.5 h-screen overflow-auto bg-neutral-700">
            {" "}
            <GripVertical
              className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              size={20}
            />
            {/* <div className="w-5 bg-white text-white"></div> */}
          </PanelResizeHandle>
        </div>

        <Panel
          className="shadow-lg overflow-auto h-full  mr-2 ml-1"
          defaultSize={50}
          minSize={40}
        >
          {/* Right Panel */}
          <PanelGroup direction="vertical">
            {/* <div> */}

            {/* top */}
            <Panel
              className="relative h-full overflow-auto mb-2 shadow-md"
              minSize={10}
            >
              <div className="sticky left-0 top-0 z-40 right-0 bg-[#353538] pl-4 py-2 ">
                <button
                  className={`tab py-2 bg-[#27272A] rounded ${
                    activeRightTab === "code" ? "tab-active text-white" : ""
                  } flex gap-1 items-center`}
                  onClick={() => setActiveRightTab("code")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-green-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <div className="text-md font-semibold">Code</div>
                </button>
              </div>

              <div>
                {activeRightTab === "code" && (
                  <div>
                    {/* Language Selector */}
                    <div className="sticky  h-12 top-11   bg-[#1E1E1E] items-center py-2   border-base-300">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value);
                        }}
                        className="bg-[#1E1E1E] pl-3 mb-1 cursor-pointer pr-4 outline-0 border-0 ring-0  focus:outline-0  focus:ring-0 focus:border-transparent"
                      >
                        <option className="font-semibold" value="cpp">
                          C++
                        </option>
                        <option className="font-semibold" value="javascript">
                          Javascript
                        </option>
                        <option className="font-semibold" value="java">
                          Java
                        </option>
                      </select>
                      <hr />
                    </div>

                    {/* monaco editor */}
                    <div className="h-screen overflow-auto">
                      <Editor
                        className="h-auto"
                        language={getLanguageForMonaco(selectedLanguage)}
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        theme="vs-dark"
                        options={{
                          fontSize: 14,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: true,
                          automaticLayout: true,
                          tabSize: 2,
                          insertSpaces: true,
                          wordWrap: "on",
                          lineNumbers: "on",
                          glyphMargin: false,
                          folding: true,
                          lineDecorationsWidth: 10,
                          lineNumbersMinChars: 3,
                          renderLineHighlight: "line",
                          selectOnLineNumbers: true,
                          roundedSelection: false,
                          readOnly: false,
                          cursorStyle: "line",
                          mouseWheelZoom: true,
                          smoothScrolling: true,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            <PanelResizeHandle className="relative w-full h-0.5 bg-neutral-700">
              <GripHorizontal
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                size={20}
              />
            </PanelResizeHandle>

            {/* bottom */}
            <Panel
              className="mt-2  overflow-auto h-full   bg-[#262626] shadow-lg shadow-neutral-700"
              minSize={10}
            >
              {/* rightbottompanel */}
              <div className="tabs tabs-bordered bg-[#353538] pl-4 py-1">
                <button
                  className={`tab ${
                    activeRightBottom === "testcase"
                      ? "tab-active text-white bg-zinc-800"
                      : ""
                  } flex gap-1 items-center`}
                  onClick={() => setActiveRightBottom("testcase")}
                >
                  <SquareCheck className="h-4 w-4 text-green-500" />
                  <div className="text-md">Testcase</div>
                </button>

                <button
                  className={`tab text-white ${
                    activeRightBottom === "result"
                      ? "tab-active  bg-zinc-800"
                      : ""
                  } 
        } flex gap-1 items-center`}
                  onClick={() => setActiveRightBottom("result")}
                >
                  {loading ? (
                    <ClipLoader size={16} color={`${"text-green-500"}`} />
                  ) : (
                    <Terminal className="h-4 w-4 text-green-500" />
                  )}
                  <div className="text-md">Test Result</div>
                </button>
              </div>

              {/* rightbottomcontent */}
              <div className="h-full overflow-auto">
                {activeRightBottom === "result" && (
                  <div className="bg-[#1e1e1e] h-[70vh] overflow-auto text-white p-4 rounded-md w-full font-mono text-sm">
                    {runResult?.success === true ? (
                      <div>
                        <div className="flex items-center mb-3 gap-5 space-y-2">
                          <h4 className="font-bold text-green-500 text-lg">
                            Accepted
                          </h4>
                          <p className="text-gray-400 text-md">
                            Runtime: {runResult?.runtime + " sec"}
                          </p>
                        </div>

                        <div className="flex border-b border-gray-700 mb-4">
                          {runResult?.testCases.map((test, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTab(idx)}
                              className={`px-3 py-1 mr-1 flex justify-center gap-2 cursor-pointer rounded-t ${
                                activeTab === idx
                                  ? "bg-[#2d2d2d] border-l border-r border-t border-gray-700"
                                  : "bg-[#1e1e1e] text-gray-400"
                              }`}
                            >
                              {test?.status?.id === 3 ? (
                                <span className="text-green-500">
                                  <Check />
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  <X />
                                </span>
                              )}
                              <span>Case</span> {idx + 1}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="block mb-1">Input</label>
                            <input
                              type="text"
                              value={runResult?.testCases[activeTab].stdin}
                              readOnly
                              className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Output</label>
                            <input
                              type="text"
                              value={runResult?.testCases[activeTab].stdout}
                              readOnly
                              className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Expected</label>
                            <input
                              type="text"
                              value={
                                runResult?.testCases[activeTab].expected_output
                              }
                              readOnly
                              className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    ) : runResult?.success === false ? (
                      <div>
                        <div className="flex items-center mb-3 gap-5 space-y-2">
                          <h4 className="font-bold text-red-500 text-lg">
                            Wrong Answer
                          </h4>
                          <p className="text-gray-400 text-md">
                            Runtime: {runResult?.runtime + " sec"}
                          </p>
                        </div>
                        <div className="flex border-b border-gray-700 mb-4">
                          {runResult?.testCases?.map((test, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveTab(idx)}
                              className={`px-3 py-1 mr-1 flex justify-center gap-2 cursor-pointer rounded-t ${
                                activeTab === idx
                                  ? "bg-[#2d2d2d] border-l border-r border-t border-gray-700"
                                  : "bg-[#1e1e1e] text-gray-400"
                              }`}
                            >
                              {test?.status?.id === 3 ? (
                                <span className="text-green-500">
                                  <Check />
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  <X />
                                </span>
                              )}
                              <span>Case</span> {idx + 1}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="block mb-1">Input</label>
                            <input
                              type="text"
                              value={runResult?.testCases[activeTab].stdin}
                              readOnly
                              className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Output</label>
                            <input
                              type="text"
                              value={runResult?.testCases[activeTab].stdout}
                              readOnly
                              className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">Expected</label>
                            <input
                              type="text"
                              value={
                                runResult?.testCases[activeTab].expected_output
                              }
                              readOnly
                              className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-20 text-center text-sm text-gray-400">
                        You must run your code first
                      </div>
                    )}
                  </div>
                )}

                {activeRightBottom === "testcase" && (
                  <div className="bg-[#1e1e1e] h-[50vh] overflow-auto text-white p-4 rounded-md w-full font-mono text-sm">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700 mb-4">
                      {problem?.visibleTestCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(idx)}
                          className={`px-3 py-1 mr-1 cursor-pointer rounded-t ${
                            activeTab === idx
                              ? "bg-[#2d2d2d] border-l border-r border-t border-gray-700"
                              : "bg-[#1e1e1e] text-gray-400"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Active Test Case */}
                    <div className="space-y-2">
                      <div>
                        <label className="block mb-1">Input</label>
                        <input
                          type="text"
                          value={problem?.visibleTestCases[activeTab].input}
                          readOnly
                          className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Output</label>
                        <input
                          type="text"
                          value={problem?.visibleTestCases[activeTab].output}
                          readOnly
                          className="w-full bg-[#2d2d2d] text-white p-2 rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
            {/* </div>  */}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  </div>
);
}

export default ProblemPage;