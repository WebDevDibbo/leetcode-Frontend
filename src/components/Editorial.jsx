import { useState, useRef, useEffect } from 'react';
import { Pause, Play,Settings, Volume2, VolumeOff, Expand, X, Check } from 'lucide-react';


const Editorial = ({secureUrl, duration, thumbnailUrl, cloudName,publicId}) => {
    // console.log('edit',problem)

  const videoQualities = {
    "auto": `https://res.cloudinary.com/${cloudName}/video/upload/q_auto/${publicId}.mp4`,
    "1080p": `https://res.cloudinary.com/${cloudName}/video/upload/q_80/${publicId}.mp4`,
    "720p": `https://res.cloudinary.com/${cloudName}/video/upload/q_60/${publicId}.mp4`,
    "480p": `https://res.cloudinary.com/${cloudName}/video/upload/q_40/${publicId}.mp4`,
};

  const qualities = [
    { label: "auto", value: "auto" },
    { label: "1080p", value: "1080p" },
    { label: "720p", value: "720p" },
    { label: "480p", value: "480p" },
  ];

  // const dialogRef = useRef(null);
  // const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume,setVolume]  = useState(1);
  const [soundHover, setSoundHover] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [settingoff, setSettingoff] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCross = () => {
    setSettingoff(!settingoff);

  }
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullScreen = () => {
    const videoContainer = document.getElementById('video-container').parentElement;

    if(!document.fullscreenElement)
      videoContainer.requestFullscreen();
    else 
      document.exitFullscreen();
  }

  // Function to open the dialog using the non-modal 'show()' method
  const handleOpenDialog = () => {
    setSettingoff(!settingoff)
  };

   const handleQualitySelect = (quality) => {

    const video = videoRef.current;
    if(!video) return;

    const currentTime = video.currentTime;
    const isPlaying = !video.paused;

    video.src = videoQualities[quality];
    video.load();

    //restore position
  video.addEventListener(
    "loadedmetadata",
    () => {
      video.currentTime = currentTime;
      if (isPlaying) {
        video.play().catch((err) => console.warn("Playback blocked:", err));
      }
    },
    { once: true }
  );
    setSelectedQuality(quality);
  };


  const handleVolume = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if(videoRef.current)
      videoRef.current.volume = newVolume;
  }

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  return (
    <div
      className="relative w-full max-w-2xl shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        id="video-container"
        ref={videoRef}
        src={videoQualities[selectedQuality]}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-screen aspect-video bg-black cursor-pointer"
      >
        {/* <source src={videoQualities[selectedQuality]} type="video/mp4" /> */}
      </video>

      {/* Video Controls Overlay */}
      {/* Video Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
          !isPlaying && "opacity-100"
        } ${isPlaying && isHovering ? "opacity-100" : "opacity-0"}`}
      >
        {/* Play/Pause Button */}

        {/* Progress Bar */}
        <div className="flex items-center w-full mt-2">
          <button
            onClick={togglePlayPause}
            className="cursor-pointer bg-cyan-700 px-4 py-2 text-white mr-3"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <span className="text-white text-sm mr-2">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="cursor-pointer accent-[#FF0033] range-xs flex-1"
          />
          <span className="text-white text-sm ml-2">
            {formatTime(duration)}
          </span>
          <div
            className={`cursor-pointer ml-2 mr-1 relative w-6  h-8`}
            onMouseEnter={() => setSoundHover(true)}
            onMouseLeave={() => setSoundHover(false)}
          >
            {soundHover && (
              <input
                min={0}
                max={100}
                onChange={handleVolume}
                value={volume * 100}
                className={`cursor-pointer absolute right-[-3.4rem]  bottom-22 rotate-[-90deg]  accent-[#880808]`}
                type="range"
              />
            )}
            {volume == 0 ? (
              <VolumeOff
                onClick={() => {
                  setVolume(1);
                  videoRef.current.volume = 1;
                }}
                className="left-1 size-6 absolute bottom-1 cursor-pointer"
              />
            ) : (
              <Volume2
                onClick={() => {
                  videoRef.current.volume = 0;
                  setVolume(0);
                }}
                className="left-1 size-6  absolute bottom-1 cursor-pointer"
              />
            )}
          </div>
          <p className="ml-2 cursor-pointer">
            <Settings className="size-5" onClick={handleOpenDialog} />
          </p>
          <Expand
            onClick={handleFullScreen}
            className="cursor-pointer ml-2 size-5"
          />
        </div>
      </div>
      {/* <p className="cursor-pointer"> */}
      <div
        id="dialog"
        className={`${
          !settingoff && "hidden -z-10"
        } absolute top-0 bg-black w-full h-full max-w-2xl`}
      >
        <p
          className={`${
            !settingoff && "hidden"
          }  font-semibold flex items-center justify-between mb-2 text-lg pt-3 pr-5 pl-3`}
        >
          <span>Settings</span>{" "}
          <X
            onClick={handleCross}
            className="cursor-pointer size-5 mt-1 font-semibold"
          />
        </p>
        <hr className="mb-2" />
        <div>
          {/* Quality Selector */}
          {
            <div
              className={`${!settingoff && "hidden -z-10"} ${
                settingoff && "block z-10"
              } grid place-items-start`}
            >
              {/* {Object.keys(videoQualities).map((quality) => 
               
              (
               
              <button
                key={quality}
                
                onClick={()=>handleQuality(quality)}
                className={`cursor-pointer px-3 py-1 w-full mb-2 text-sm font-semibold transition  hover:bg-[#343434]
              text-white}
            `}
              >
                
                {quality}
              </button>
                )
            )} */}
               {qualities.map((q) => (
              <button
                key={q.value}
                onClick={() => handleQualitySelect(q.value)}
                className={`w-full flex items-center cursor-pointer justify-between px-3 py-1.5 text-sm hover:bg-white/10 transition ${
                  selectedQuality === q.value ? "text-blue-400" : "text-gray-300"
                }`}
              >
                <span>{q.label}</span>
                {selectedQuality === q.value && <Check size={14} />}
              </button>
            ))}
            </div>
          }
        </div>
      </div>
      {/* </p> */}
    </div>
  );
};


export default Editorial;
