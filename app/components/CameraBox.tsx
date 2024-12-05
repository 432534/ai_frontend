"use client"

import { useEffect, useRef } from "react"

interface CameraBoxProps {
  stream: MediaStream | null;
}

const CameraBox = ({ stream }: CameraBoxProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && stream) {
      videoElement.srcObject = stream;
      videoElement.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className="rounded-lg"
        />
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-300">Camera feed will appear here</p>
          <p className="text-sm text-gray-400">Please grant camera permissions</p>
        </div>
      )}
    </div>
  );
};

export default CameraBox;