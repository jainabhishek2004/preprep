'use client';

import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodingTestPage() {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("cpp");

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleRunCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      alert(`Running ${language} code:\n\n${code}`);
    } else {
      alert("Editor not ready yet!");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
        <h1 className="text-2xl font-bold text-blue-400">Prepup</h1>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded focus:outline-none border border-gray-600"
          >
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <button
            onClick={handleRunCode}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
          >
            Run Code
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-grow gap-4 overflow-hidden">
        {/* Left Side – Problem */}
        <div className="w-1/2 bg-gray-800 rounded-xl p-5 overflow-y-auto">
          <h2 className="text-xl font-semibold text-blue-300 mb-3">
            🧩 Two Sum
          </h2>
          <p className="text-gray-200 leading-relaxed">
            Given an array of integers <code>nums</code> and an integer{" "}
            <code>target</code>, return the indices of the two numbers such that
            they add up to <code>target</code>.
          </p>

          <div className="bg-gray-900 mt-4 p-3 rounded-lg text-sm font-mono text-gray-300">
{`Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Explanation:
Because nums[0] + nums[1] == 9, we return [0, 1].`}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-blue-300">Constraints:</h3>
            <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
            </ul>
          </div>
        </div>

        {/* Right Side – Editor */}
        <div className="w-1/2 bg-gray-800 rounded-xl overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            defaultValue="// Write your code here"
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: true,
            }}
          />
        </div>
      </main>
    </div>
  );
}
