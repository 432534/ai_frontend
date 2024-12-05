"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import CameraBox from "../components/CameraBox";
import Instructions from "../components/Instructions";
import { useRouter } from "next/navigation";
import VideoRecorder from "../components/VideoRecorder";

const First = () => {
  const router = useRouter();

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    speaker: false,
    screenShare: false,
    audioCheck: false,
  });

  const [startClicked, setStartClicked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [, setPermissionAttempts] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      // Handling screen resize logic if necessary
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const resetPermissions = () => {
    setPermissions({
      camera: false,
      microphone: false,
      speaker: false,
      screenShare: false,
      audioCheck: false,
    });
  };

  const handleStartClick = async () => {
    resetPermissions();
    setStartClicked(true);
    setPermissionAttempts((prev) => prev + 1);

    try {
      // Request camera and microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setPermissions((prev) => ({
        ...prev,
        camera: true,
        microphone: true,
      }));
      mediaStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Permission error:", err);
      if (err instanceof Error && err.name === "NotReadableError") {
        alert("Camera is already in use or not accessible. Please check your camera settings.");
      } else {
        alert("An error occurred while trying to access the camera. Please check your permissions.");
      }
      resetPermissions();
    }
  };

  const handleStartInterview = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    router.push("/interview");
  };

  const allPermissionsGranted =
    permissions.camera &&
    permissions.microphone &&
    permissions.speaker &&
    permissions.screenShare &&
    permissions.audioCheck;

  const buttonLabel = allPermissionsGranted
    ? "Start Interview"
    : startClicked
    ? "Checking Permissions..."
    : "Start Now";

  return (
    <div className="min-h-screen bg-gradient text-white flex flex-col bg-gray-800">
      <Head>
        <title>Trainee Interview</title>
      </Head>

      <Navbar />

      <main className="p-6 flex justify-center items-center">
        <div className="container mx-auto flex flex-col md:flex-row gap-8 h-[80vh] pt-[8vh]">
          <div className="flex-grow bg-gray-800 rounded-lg shadow-lg p-6 shadow-white">
            {/* Camera Box */}
            <div className="mt-[-10vh] text-white font-semibold text-2xl">TRAINEE INTERVIEW</div>
            {allPermissionsGranted && !isRecording ? (
              <VideoRecorder
                onTestCompleted={() => console.log("Test Completed!")}
                setIsRecording={setIsRecording}
                isRecording={isRecording}
              />
            ) : (
              <CameraBox />
            )}
          </div>

          {/* Instructions */}
          <div className="flex-grow md:w-1/2 bg-gray-800 rounded-lg p-6 flex flex-col justify-between shadow-xl shadow-white">
            <div className="w-full h-[10vh] flex justify-end gap-5">
              <div className="h-[5vh] w-[15vh] border-[1px] border-orange-500 mt-[-10vh] p-[4px] pl-8 rounded-lg">Zeko</div>
              <div className="h-[5vh] w-[15vh] border-[1px] border-orange-500 mt-[-10vh] p-[4px] pl-8 rounded-lg"><h1>26 min</h1></div>
            </div>
            <Instructions startClicked={startClicked} permissions={permissions} />
            <div className="mt-6 flex flex-col space-y-4">
              <button
                onClick={handleStartClick}
                disabled={startClicked && !allPermissionsGranted}
                className={`${
                  startClicked && !allPermissionsGranted
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                } text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105`}
              >
                {buttonLabel}
              </button>

              {allPermissionsGranted && (
                <button
                  onClick={handleStartInterview}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                >
                  Start Interview
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default First;
