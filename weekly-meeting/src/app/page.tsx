"use client";

import { useEffect, useState } from "react";
import LoginPage from "@/components/LoginPage";
import MeetingForm from "@/components/MeetingForm";
import MeetingList from "@/components/MeetingList";
import { getWeekKey } from "@/lib/weekUtils";

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const currentWeekKey = getWeekKey(new Date());

  useEffect(() => {
    const saved = localStorage.getItem("weekly-meeting-user");
    if (saved) setUserName(saved);
  }, []);

  function handleLogout() {
    localStorage.removeItem("weekly-meeting-user");
    setUserName(null);
  }

  function handleSaved() {
    setRefreshKey((k) => k + 1);
  }

  if (userName === null) {
    return <LoginPage onLogin={setUserName} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">팀 주간회의</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <MeetingForm
          userName={userName}
          weekKey={currentWeekKey}
          onSaved={handleSaved}
        />
        <MeetingList
          initialWeekKey={currentWeekKey}
          refreshKey={refreshKey}
        />
      </main>
    </div>
  );
}
