"use client";

import { useEffect, useState } from "react";
import { MeetingEntry } from "@/lib/storage";
import { getWeekLabel, addWeeks, getWeekKey } from "@/lib/weekUtils";

interface Props {
  initialWeekKey: string;
  refreshKey: number;
}

export default function MeetingList({ initialWeekKey, refreshKey }: Props) {
  const [weekKey, setWeekKey] = useState(initialWeekKey);
  const [entries, setEntries] = useState<MeetingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const currentWeekKey = getWeekKey(new Date());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/meetings?weekKey=${weekKey}`)
      .then((r) => r.json())
      .then((data: MeetingEntry[]) => {
        setEntries(data);
        setLoading(false);
      });
  }, [weekKey, refreshKey]);

  function prev() {
    setWeekKey((k) => addWeeks(k, -1));
  }

  function next() {
    setWeekKey((k) => addWeeks(k, 1));
  }

  const isCurrentWeek = weekKey === currentWeekKey;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-b border-gray-200">
        <button
          onClick={prev}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 font-bold text-lg transition-colors"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="text-base font-bold text-gray-800">{getWeekLabel(weekKey)}</p>
          {isCurrentWeek && (
            <span className="text-xs text-blue-500 font-semibold">이번 주</span>
          )}
        </div>
        <button
          onClick={next}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 font-bold text-lg transition-colors"
        >
          ›
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">불러오는 중...</div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center text-gray-400">작성된 내용이 없습니다</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-4 py-3 text-left font-semibold w-24 border-b border-gray-100">이름</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-100">금주 실적</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-100">차주 계획</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-gray-100">공유사항</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 font-semibold text-blue-700 align-top whitespace-nowrap border-b border-gray-100">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap border-b border-gray-100">
                    {entry.thisWeek || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap border-b border-gray-100">
                    {entry.nextWeek || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap border-b border-gray-100">
                    {entry.shared || <span className="text-gray-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
