"use client";

import { useState } from "react";

interface Props {
  onLogin: (name: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("weekly-meeting-user", trimmed);
    onLogin(trimmed);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">팀 주간회의</h1>
        <p className="text-center text-gray-500 text-sm mb-8">이름을 입력하고 시작하세요</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-3 transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
