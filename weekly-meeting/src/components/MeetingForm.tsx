"use client";

import { useState, useEffect } from "react";
import { MeetingEntry } from "@/lib/storage";

interface Props {
  userName: string;
  weekKey: string;
  onSaved: () => void;
}

export default function MeetingForm({ userName, weekKey, onSaved }: Props) {
  const [thisWeek, setThisWeek] = useState("");
  const [nextWeek, setNextWeek] = useState("");
  const [shared, setShared] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/meetings?weekKey=${weekKey}`)
      .then((r) => r.json())
      .then((entries: MeetingEntry[]) => {
        const mine = entries.find((e) => e.name === userName);
        if (mine) {
          setExistingId(mine.id);
          setThisWeek(mine.thisWeek);
          setNextWeek(mine.nextWeek);
          setShared(mine.shared);
          setIsOpen(true);
        } else {
          setExistingId(null);
          setThisWeek("");
          setNextWeek("");
          setShared("");
        }
        setLoading(false);
      });
  }, [weekKey, userName]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: existingId ?? undefined,
        name: userName,
        weekKey,
        thisWeek,
        nextWeek,
        shared,
      }),
    });
    setSaving(false);
    setIsOpen(false);
    onSaved();
  }

  async function handleDelete() {
    if (!existingId) return;
    if (!confirm("이번 주 내용을 삭제할까요?")) return;
    setDeleting(true);
    await fetch(`/api/meetings?weekKey=${weekKey}&id=${existingId}`, { method: "DELETE" });
    setDeleting(false);
    setExistingId(null);
    setThisWeek("");
    setNextWeek("");
    setShared("");
    setIsOpen(false);
    onSaved();
  }

  if (loading) return null;

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-3 transition-colors"
        >
          {existingId ? "내 회의 내용 수정" : "내 회의 내용 작성"}
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {existingId ? "내 회의 내용 수정" : "내 회의 내용 작성"}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">금주 실적</label>
              <textarea
                value={thisWeek}
                onChange={(e) => setThisWeek(e.target.value)}
                rows={3}
                placeholder="이번 주 실적을 입력하세요"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">차주 계획</label>
              <textarea
                value={nextWeek}
                onChange={(e) => setNextWeek(e.target.value)}
                rows={3}
                placeholder="다음 주 계획을 입력하세요"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">공유사항</label>
              <textarea
                value={shared}
                onChange={(e) => setShared(e.target.value)}
                rows={2}
                placeholder="공유할 내용을 입력하세요"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg py-2 transition-colors"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              {existingId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-lg py-2 transition-colors"
                >
                  {deleting ? "삭제 중..." : "삭제"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
