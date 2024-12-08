import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

let videoTransferName: string | undefined;
let mediaRecorder: MediaRecorder | undefined;
let userId: string | undefined;

const socket = io("http://localhost:5000");
export const StartRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferName = `${uuid()}-${onSources.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const StopRecording = () => {
  mediaRecorder?.stop();
};

export const onStopeRecoding = () => {
  alert("stop running");
  mediaRecorder?.stop();
  hidePluginWindow(false);

  socket.emit("process-video", {
    fileName: videoTransferName,
    userId,
  });
};

export const onDataAvailable = (event: BlobEvent) => {
  console.log("data available");

  socket.emit("video-chunks", {
    chunks: event.data,
    fileName: videoTransferName,
  });
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    const constraints = {
      audio: false,
      video: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: onSources.screen,
        minWidth: onSources.preset === "HD" ? 1920 : 1280,
        maxWidth: onSources.preset === "HD" ? 1920 : 1280,
        minHeight: onSources.preset === "HD" ? 1080 : 720,
        maxHeight: onSources.preset === "HD" ? 1080 : 720,
        frameRate: 30,
      },
    };
    userId = onSources.id;

    //creating the stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //audio && webcam stream
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: onSources.audio ? { deviceId: { exact: onSources.audio } } : false,
    });

    if (videoElement && videoElement.current) {
      videoElement.current.srcObject = stream;
      await videoElement.current.play();
    }

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    // Ensure mediaRecorder is initialized before starting
    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    // Set the ondataavailable event handler
    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = onStopeRecoding; // Ensure this is set before starting

    // Start recording
    mediaRecorder.start(1000); // Start recording with a timeslice of 1000ms
  }
};
