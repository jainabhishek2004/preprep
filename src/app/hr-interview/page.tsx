// "use client";

// import { useState } from "react";
// import { useUser, SignInButton } from "@clerk/nextjs";

// export default function StartInterviewButton() {
//   const { isSignedIn } = useUser();
//   const [question, setQuestion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🧩 Helper: Speak text using browser TTS
//   const speakText = (text:string) => {
//     if (!text) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.rate = 1; // speed (0.5–2)
//     utterance.pitch = 1; // tone (0–2)
//     speechSynthesis.speak(utterance);
//   };

//   const handleClick = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/question", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           input: "not remember properly bit nervous",
//           resumeText: `Abhishek Jain from Delhi, pursuing B.Tech in Information Technology at Bharati Vidyapeeth College of Engineering, New Delhi (Sept 2023 – July 2027). Skilled in C++, C, Java, HTML, CSS, JavaScript, Node.js, MongoDB, React, Express, VS Code, and Git/GitHub. Worked as a Software Development Intern at Founder’s Cart (July 2025 – August 2025), where I built Pipedrive extensions using Express.js and React, improving CRM workflows and modular API integrations. Previously interned at Tring Box (May 2025 – July 2025) where I built a React + Next.js partner app with live event scheduling and 25+ REST API integrations. Also contributed to open source during Social Winter of Code (Dec 2023 – Mar 2025) on React-Blog and Trip-Tailor projects. Projects include Smriti.live (AI-powered study assistant with Twilio reminders) and AnonTales (AI-based storytelling platform backend). Achievements: 1st Place in Avinya 2024 Case Study Competition, 3rd Place in Pitch Perfect at BVest 2024, and 2nd Place in MLSAC Ideathon for innovative problem-solving.`,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setQuestion(data.question);
//         speakText(data.question); // 🎤 Speak it aloud
//       } else {
//         setError(data.error || "Something went wrong.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to call API.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isSignedIn) {
//     return (
//       <div>
//         <p>Please sign in to start the Amazon HR interview.</p>
//         <SignInButton mode="modal">
//           <button style={{ padding: "10px 20px", cursor: "pointer" }}>
//             Sign In
//           </button>
//         </SignInButton>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button
//         onClick={handleClick}
//         disabled={loading}
//         style={{
//           padding: "10px 20px",
//           cursor: "pointer",
//           borderRadius: "8px",
//           backgroundColor: "#232F3E",
//           color: "white",
//           border: "none",
//         }}
//       >
//         {loading ? "Loading..." : "Start Amazon HR Interview"}
//       </button>

//       {question && (
//         <div style={{ marginTop: "20px" }}>
//           <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
//             Question: {question}
//           </div>
//           <button
//             onClick={() => speakText(question)}
//             style={{
//               padding: "8px 16px",
//               borderRadius: "6px",
//               backgroundColor: "#FF9900",
//               color: "white",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             🔊 Replay Voice
//           </button>
//         </div>
//       )}

//       {error && (
//         <div style={{ marginTop: "20px", color: "red" }}>{error}</div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useUser, SignInButton } from "@clerk/nextjs";

// export default function StartInterviewButton() {
//   const { isSignedIn, user } = useUser();
//   const [question, setQuestion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [listening, setListening] = useState(false);
//   const [answer, setAnswer] = useState("");
//   const [videoOn, setVideoOn] = useState(true);

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   // 🧠 Setup user webcam (like Google Meet)
//   useEffect(() => {
//     if (videoOn && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           if (videoRef.current) videoRef.current.srcObject = stream;
//         })
//         .catch(() => console.error("Camera access denied."));
//     } else {
//       if (videoRef.current?.srcObject) {
//         (videoRef.current.srcObject as MediaStream)
//           .getTracks()
//           .forEach((t) => t.stop());
//         videoRef.current.srcObject = null;
//       }
//     }
//   }, [videoOn]);

//   // 🎤 Text-to-Speech
//   const speakText = (text: string) => {
//     if (!text) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     speechSynthesis.speak(utterance);
//   };

//   // 🎙️ Voice Recognition setup
//   const startListening = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported in this browser");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onend = () => setListening(false);
//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       setListening(false);
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setAnswer(transcript);
//       console.log("User Answer:", transcript);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   const handleClick = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           input: "Start interview",
//           resumeText: `Abhishek Jain from Delhi, pursuing B.Tech in Information Technology at Bharati Vidyapeeth College of Engineering, New Delhi (Sept 2023 – July 2027)...`,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setQuestion(data.question);
//         speakText(data.question);
//       } else {
//         setError(data.error || "Something went wrong.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to call API.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isSignedIn) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
//         <p className="mb-4 text-lg">Please sign in to start the HR interview</p>
//         <SignInButton mode="modal">
//           <button className="bg-blue-500 px-4 py-2 rounded-lg">Sign In</button>
//         </SignInButton>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* 🎥 Left side - User video */}
//       <div className="flex-1 flex items-center justify-center relative">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="w-[80%] rounded-2xl shadow-lg border border-gray-700"
//         />
//         <button
//           onClick={() => setVideoOn((v) => !v)}
//           className="absolute bottom-8 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
//         >
//           {videoOn ? "📷 Turn Off Camera" : "📸 Turn On Camera"}
//         </button>
//       </div>

//       {/* 💬 Right side - Interview Panel */}
//       <div className="flex-1 flex flex-col justify-center items-center p-10">
//         <h1 className="text-2xl font-semibold mb-6 text-center">
//           Amazon HR Virtual Interview
//         </h1>

//         <button
//           onClick={handleClick}
//           disabled={loading}
//           className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl mb-6"
//         >
//           {loading ? "Loading..." : "🎯 Start Interview"}
//         </button>

//         {question && (
//           <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
//             <p className="text-lg font-medium mb-4">
//               🗣️ {question}
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => speakText(question)}
//                 className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
//               >
//                 🔊 Replay
//               </button>
//               <button
//                 onClick={startListening}
//                 className={`px-4 py-2 rounded-lg ${
//                   listening ? "bg-red-600" : "bg-green-600 hover:bg-green-500"
//                 }`}
//               >
//                 {listening ? "🎙️ Listening..." : "🎤 Speak Answer"}
//               </button>
//             </div>
//             {answer && (
//               <p className="mt-4 text-gray-300">
//                 <strong>Your Answer:</strong> {answer}
//               </p>
//             )}
//           </div>
//         )}

//         {error && <p className="text-red-500 mt-6">{error}</p>}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function StartInterviewButton() {
  const { isSignedIn } = useUser();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [answer, setAnswer] = useState("");
  const [videoOn, setVideoOn] = useState(true);
  const [interviewerResponse, setInterviewerResponse] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 🎥 Setup webcam
  useEffect(() => {
    if (videoOn && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => console.error("Camera access denied."));
    } else {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [videoOn]);

  // 🗣 Text-to-Speech
  const speakText = (text: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // 🎤 Voice Recognition (Stable + Reliable)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
      setAnswer("");
      setInterviewerResponse("");
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("🎤 There was an issue capturing your voice. Please try again.");
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
      console.log("User Answer:", transcript);

      // Simulate natural interviewer reaction
      setTimeout(() => {
        const responses = [
          "Alright, thank you for sharing that.",
          "Good point, let’s move on.",
          "Interesting answer.",
          "Okay, that’s clear. Let’s proceed to the next question.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        setInterviewerResponse(randomResponse);
        speakText(randomResponse);
      }, 2000);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // 🧠 Fetch question
  const handleClick = async () => {
    setLoading(true);
    setError("");
    setQuestion("");
    setAnswer("");
    setInterviewerResponse("");

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: "Start interview",
          resumeText: `Abhishek Jain from Delhi, pursuing B.Tech in Information Technology at Bharati Vidyapeeth College of Engineering, New Delhi (Sept 2023 – July 2027)...`,
        }),
      });

      // Add a natural 2s delay
      await new Promise((r) => setTimeout(r, 2000));

      const data = await res.json();

      if (res.ok) {
        setQuestion(data.question);
        speakText(data.question);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to call API.");
    } finally {
      setLoading(false);
    }
  };

  // 🧍 Require sign in
  if (!isSignedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="mb-4 text-lg">Please sign in to start the HR interview</p>
        <SignInButton mode="modal">
          <button className="bg-blue-500 px-4 py-2 rounded-lg">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  // 🎬 UI
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* 🎥 User video */}
      <div className="flex-1 flex items-center justify-center relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-[80%] rounded-2xl shadow-lg border border-gray-700 transition duration-500 hover:brightness-95"
        />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-gray-300">Recording...</p>
        </div>
        <button
          onClick={() => setVideoOn((v) => !v)}
          className="absolute bottom-8 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
        >
          {videoOn ? "📷 Turn Off Camera" : "📸 Turn On Camera"}
        </button>
      </div>

      {/* 💬 Interview panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-10">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Amazon HR Virtual Interview
        </h1>

        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl mb-6"
        >
          {loading ? "Loading..." : "🎯 Start Interview"}
        </button>

        {question && (
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
            <p className="text-lg font-medium mb-4">🗣️ {question}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => speakText(question)}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
              >
                🔊 Replay
              </button>
              <button
                onClick={startListening}
                className={`px-4 py-2 rounded-lg ${
                  listening ? "bg-red-600" : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {listening ? "🎙️ Listening..." : "🎤 Speak Answer"}
              </button>
            </div>

            {listening && (
              <p className="mt-2 text-red-400 animate-pulse">
                🎙️ Listening... please speak clearly.
              </p>
            )}

            {answer && (
              <p className="mt-4 text-gray-300">
                <strong>Your Answer:</strong> {answer}
              </p>
            )}

            {interviewerResponse && (
              <p className="mt-6 text-yellow-400 italic">
                👩‍💼 {interviewerResponse}
              </p>
            )}
          </div>
        )}

        {error && <p className="text-yellow-400 mt-6 italic">{error}</p>}
      </div>
    </div>
  );
}
