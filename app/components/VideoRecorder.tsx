"use client";

import { useRef, useState, useEffect } from "react";

interface VideoRecorderProps {
  onTestCompleted: () => void; // Callback function to be called when the test is completed
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>; // To manage recording state
  isRecording: boolean; // To know whether it's recording or not
}

const VideoRecorder = ({
  onTestCompleted,
  setIsRecording,
  isRecording,
}: VideoRecorderProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Reference to video element
  const [timeLeft, setTimeLeft] = useState(60); // 1-minute countdown for the recording
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  // Start video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        console.log("Recording chunk:", event.data);
        // Handle the recorded data (upload to server or save)
      };

      setMediaRecorder(recorder);
      recorder.start();
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsRecording(true);
      setTimeLeft(60);

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            stopRecording(); // Stop recording when time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
    }
  };

  // Stop video recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      onTestCompleted(); // Callback to indicate test completion
    }
  };

  useEffect(() => {
    if (!isRecording && mediaRecorder) {
      setTimeLeft(60); // Reset countdown when not recording
    }
  }, [isRecording, mediaRecorder]);

  return (
    <div className="flex flex-col items-center justify-center">
      {isRecording ? (
        <>
          <p className="text-lg font-bold">Time Left: {timeLeft}s</p>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="mt-4 w-full h-auto rounded-lg"
          />
        </>
      ) : (
        <button
          onClick={startRecording}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md w-full"
        >
          Start Interview
        </button>
      )}
    </div>
  );
};

export default VideoRecorder;
