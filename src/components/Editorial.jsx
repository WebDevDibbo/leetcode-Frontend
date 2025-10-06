import { useState, useRef, useEffect } from 'react';
import { Pause, Play,Settings, Volume2, VolumeOff, Expand } from 'lucide-react';


const Editorial = ({secureUrl, duration, thumbnailUrl, cloudName,publicId}) => {
    // console.log('edit',problem)

  const videoQualities = {
  auto: `https://res.cloudinary.com/${cloudName}/video/upload/q_auto/${publicId}.mp4`,
  low: `https://res.cloudinary.com/${cloudName}/video/upload/q_40/${publicId}.mp4`,
  medium: `https://res.cloudinary.com/${cloudName}/video/upload/q_60/${publicId}.mp4`,
  high: `https://res.cloudinary.com/${cloudName}/video/upload/q_80/${publicId}.mp4`
};

  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [volume,setVolume]  = useState(1);
  const [soundHover, setSoundHover] = useState(false);

  

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
    if (dialogRef.current) {
      dialogRef.current.show();
      setIsOpen(true);
    }
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  const handleVolume = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    // console.log('soudn',videoRef.current)
    if(videoRef.current)
      videoRef.current.volume = newVolume;
  }

  // Update current time during playback
  useEffect(() => {
    const video = videoRef.current;
    console.log('videoooo')
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
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className="w-full relative aspect-video bg-black cursor-pointer"
      ></video>

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
          <p className="ml-2 relative bottom-2.5 cursor-pointer">
            {" "}
            <Settings className="size-5" onClick={handleOpenDialog} />
            <dialog ref={dialogRef} id="my_modal_2" className="modal">
              <div className="modal-box w-60 h-[275px] overflow-y-auto px-0 py-0 border bg-[#000000] max-w-xs absolute right-20 bottom-30">
                <h3 className="font-bold text-lg">Hello!</h3>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </p>
          <Expand
            onClick={handleFullScreen}
            className="cursor-pointer ml-2 size-5"
          />
        </div>
      </div>
    </div>
  );
};


export default Editorial;
