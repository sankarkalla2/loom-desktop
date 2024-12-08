import { selectSources, StartRecording, StopRecording } from "@/lib/recorder";
import { cn, videoRecodingTime } from "@/lib/utils";
import { CircleStop, Pause, Square, StopCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StudioTray = () => {
  const initialTime = new Date();
  const [preview, setPreview] = useState(false);
  const [recording, setRecording] = useState(false);
  const [onTimer, setOnTimer] = useState<string>("00:00:00");
  const [counter, setCounter] = useState<number>(0);
  const [onSources, setOnSources] = useState<
    | {
        screen: string;
        id: string;
        audio: string;
        preset: "HD" | "SD";
        plan: "FREE" | "PRO";
      }
    | undefined
  >(undefined);
  useEffect(() => {
    window.ipcRenderer.on("profile-received", (event, payload) => {
      console.log("🔴", payload);
      setOnSources(payload);
    });
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const clearTime = () => {
    setOnTimer("00:00:00");
  };

  useEffect(() => {
    if (recording) {
      const recordTimerInterval = setInterval(() => {
        let time = new Date().getTime() - initialTime.getTime();
        setCounter(time);
        const recordTime = videoRecodingTime(time);

        if (onSources?.plan === "FREE" && recordTime.minutes == "05") {
          setRecording(false);
          clearTime();
          StopRecording();
        }

        setOnTimer(recordTime.length);
        if (time < 0) {
          setOnTimer("00:00:00");
          clearInterval(recordTimerInterval);
        }
      }, 1);

      return () => clearInterval(recordTimerInterval);
    }
  }, [recording]);

  useEffect(() => {
    if (onSources && onSources.screen) {
      selectSources(onSources, videoRef);
    }

    return () => {
      selectSources(onSources, videoRef);
    };
  }, [onSources]);

  if (!onSources) return <></>;
  return (
    <div className="flex flex-col justify-end gap-5 h-screen w-full">
      <video
        autoPlay
        ref={videoRef}
        className={cn("w-6/12 border-2 self-end", preview ? "hidden" : "")}
      ></video>
      <div className="rounded-full flex justify-center items-center h-20 w-full border-2 bg-[#171717]  text-white">
        <div
          {...(onSources && {
            onClick: () => {
              setRecording(true);
              StartRecording(onSources);
            },
          })}
          className={cn(
            "non-draggble rounded-full cursor-pointer hover:opacity-45 items-center justify-center",
            recording ? "bg-red-600 w-6 h-6" : "bg-red-400 w-8 h-8"
          )}
        >
          {recording && <span className="">{onTimer}</span>}
        </div>
        {!recording ? (
          <Pause
            className="non-draggble cursor-pointer hover:scale-125 transition duration-150 ml-20"
            size={32}
            stroke="none"
          />
        ) : (
          <Square
            size={32}
            className="non-draggble hover:scale-125 transition duration-150 ml-20"
            onClick={() => {
              setRecording(false);
              clearTime();
              StopRecording();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudioTray;
