import { useEffect, useRef } from "react";

function App() {
  const camera = useRef<HTMLVideoElement>(null);

  const streamWebCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (camera.current) {
      console.log("whats happening");
      camera.current.srcObject = stream;
      await camera.current.play();
    }
  };

  useEffect(() => {
    streamWebCam();
  }, []);

  return (
    <video
      ref={camera}
      className="h-screen draggble object-cover border-2 relative border-white rounded-3xl"
    ></video>
  );
}

export default App;
