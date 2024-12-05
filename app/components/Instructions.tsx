"use client";

import { FC } from "react";

interface InstructionsProps {
  startClicked: boolean;
  permissions: {
    camera: boolean;
    microphone: boolean;
    speaker: boolean;
    screenShare: boolean;
    audioCheck: boolean;
  };
}

const Instructions: FC<InstructionsProps> = ({ startClicked, permissions }) => {
  if (startClicked) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Device Check</h2>
        <ul className="list-none space-y-4 text-lg">
          <li>
            <span className="mr-2">{permissions.camera ? "✔" : "❌"}</span>
            Check Camera
          </li>
          <li>
            <span className="mr-2">{permissions.microphone ? "✔" : "❌"}</span>
            Check Microphone
          </li>
          <li>
            <span className="mr-2">{permissions.audioCheck ? "✔" : "❌"}</span>
            Say &quot;Hello&quot; for Audio Check
          </li>
          <li>
            <span className="mr-2">{permissions.speaker ? "✔" : "❌"}</span>
            Check Speaker
          </li>
          <li>
            <span className="mr-2">{permissions.screenShare ? "✔" : "❌"}</span>
            Enable Screen Share
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Instructions</h2>
      <ul className="list-decimal list-inside space-y-7 text-lg">
        <li>Ensure stable internet and choose a clean, quiet location.</li>
        <li>
          Permission for access to camera, microphone, and screen sharing is
          required.
        </li>
        <li>Be in professional attire and avoid distractions.</li>
        <li>
          Give a detailed response, providing as much information as possible.
        </li>
        <li>
          Answer the question with examples and projects you&apos;ve worked on.
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
