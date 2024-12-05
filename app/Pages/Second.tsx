"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Second = () => {
  const router = useRouter();
  const [question] = useState("Introduce yourself");
  const [showLoader, setShowLoader] = useState(false);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);

  // Refs for media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSubmit = () => {
    stopRecording(true);
  };

  const stopRecording = (isManualSubmit = false) => {
    // Stop the recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Stop video tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    new Blob(recordedChunksRef.current, { type: "video/webm" });
    recordedChunksRef.current = [];

    // Navigate and show message
    router.push("/", {
      query: {
        message: isManualSubmit
          ? "Answer submitted successfully!"
          : "Test completed!",
      },
    });
  };

  useEffect(() => {
    const speech = new SpeechSynthesisUtterance(question);
    speech.onend = () => {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
        setRecordingStarted(true);
      }, 5000);
    };

    window.speechSynthesis.speak(speech);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [question]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;

    const startRecordingAndCountdown = async () => {
      if (recordingStarted && !isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          // Store stream reference for later stopping
          streamRef.current = stream;

          // Set up video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            videoRef.current.muted = true; // Ensuring the video is muted
          }

          // Create MediaRecorder
          const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm",
          });

          // Handle data available
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };

          // Handle recording stop
          recorder.onstop = () => {
            const videoBlob = new Blob(recordedChunksRef.current, {
              type: "video/webm",
            });
            const videoURL = URL.createObjectURL(videoBlob);
            // You can use videoURL to play or save the video
          };

          mediaRecorderRef.current = recorder;
          recorder.start();

          // Countdown for 60 seconds
          let remainingTime = 60;
          countdownTimer = setInterval(() => {
            if (remainingTime > 0) {
              remainingTime -= 1;
              setTimeLeft(remainingTime);
            } else {
              clearInterval(countdownTimer);
              stopRecording();
            }
          }, 1000);
        } catch (error) {
          console.error("Error accessing media devices.", error);
        }
      }
    };

    startRecordingAndCountdown();

    return () => clearInterval(countdownTimer);
  }, [recordingStarted, isRecording, question]);

  return (
    <div className="min-h-screen bg-gradient bg-gray-800 text-white">
      <div className="p-8">
        <video
          ref={videoRef}
          className="w-full h-full border border-gray-500 rounded-md"
          muted
        />
      </div>
      <div className="p-8">
        <h1 className="text-3xl">{question}</h1>
        <p className="text-xl">Time Left: {timeLeft}s</p>
        {showLoader && <div>Loading...</div>}
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default Second;
