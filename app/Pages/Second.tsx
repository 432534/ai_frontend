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
      //@ts-expect-error: Unable to find the type error so used it
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
  
          streamRef.current = stream;
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
  
          const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm",
          });
  
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };
  
          recorder.onstop = () => {
            new Blob(recordedChunksRef.current, {
              type: "video/webm",
            });
          };
  
          recorder.start();
          mediaRecorderRef.current = recorder;
          setIsRecording(true);
  
          countdownTimer = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearInterval(countdownTimer);
                stopRecording();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (err) {
          console.error("Error starting recording:", err);
        }
      }
    };
  
    if (recordingStarted) {
      startRecordingAndCountdown();
    }
  
    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording, recordingStarted, stopRecording]);
  

  return (
    <div className="min-h-full bg-gray-900 text-white flex flex-col">
      {!showLoader && !recordingStarted && (
        <h1 className="text-2xl font-bold">{question}</h1>
      )}

      {showLoader && (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
          <p className="text-xl ml-4">Loading...</p>
        </div>
      )}

      {recordingStarted && !showLoader && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Answer Recording</h2>
          <div className="bg-gray-800 p-4 rounded-md">
            <p className="text-lg mb-4">Time Left: {timeLeft} seconds</p>

            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full max-w-md mx-auto mb-4 rounded-md"
            />

            {isRecording && (
              <div className="flex justify-center space-x-4">
                <div className="text-red-500 font-bold animate-pulse">
                  Recording in Progress...
                </div>
                {timeLeft > 10 && (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Second;
