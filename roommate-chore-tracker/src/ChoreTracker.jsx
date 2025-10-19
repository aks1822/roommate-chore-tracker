import React, { useState, useEffect } from "react";

export default function ChoreTracker() {
  const roommates = ["Akshara", "Priyanka", "Divya"];
  const [today, setToday] = useState(new Date());
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("choreHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("choreHistory", JSON.stringify(history));
  }, [history]);

  // Helper: choose person in rotation
  const getPerson = (indexOffset = 0) =>
    roommates[(indexOffset % roommates.length + roommates.length) % roommates.length];

  // Compute relative day number since "today = day 0"
  const getDayOffset = (offset = 0) => {
    const current = new Date(today);
    const base = new Date(today);
    base.setHours(0, 0, 0, 0);
    current.setDate(today.getDate() + offset);
    return Math.floor((current - base) / (1000 * 60 * 60 * 24)) + offset;
  };

  // --- TODAY’s Chores ---
  const dayOfWeek = today.getDay(); // Sunday = 0
  const diff = 0; // today offset = 0

  // Mopping: Sunday only, starts with Akshara
  const mopping =
    dayOfWeek === 0 ? getPerson(Math.floor(diff / 7)) : null;

  // Laundry: daily, starts today with Divya
  const laundry = getPerson(diff - 1); // so day0=Divya, day1=Akshara, etc.

  // Dusting: every alternate day starting tomorrow (Priyanka)
  const dusting =
    dayOfWeek !== 0 && diff % 2 === 1 ? getPerson(diff) : null;

  // --- TOMORROW’s Chores ---
  const tomorrowDay = (dayOfWeek + 1) % 7;
  const tDiff = diff + 1;

  const moppingTomorrow =
    tomorrowDay === 0 ? getPerson(Math.floor(tDiff / 7)) : null;
  const laundryTomorrow = getPerson(tDiff - 1);
  const dustingTomorrow =
    tomorrowDay !== 0 && tDiff % 2 === 1 ? getPerson(tDiff) : null;

  // --- Mark Done & History ---
  const handleDone = (task, person) => {
    const newEntry = {
      date: today.toDateString(),
      task,
      person,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [...prev, newEntry]);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all history?")) {
      setHistory([]);
      localStorage.removeItem("choreHistory");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🏡 Roommate Chore Tracker</h1>
      <h2 className="text-xl mb-6">Today: {today.toDateString()}</h2>

      {/* TODAY */}
      <div className="grid gap-4 w-full max-w-md">
        {mopping && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">🧽 Mopping</h3>
            <p>{mopping}</p>
            <button
              onClick={() => handleDone("Mopping", mopping)}
              className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Mark as Done
            </button>
          </div>
        )}

        {dusting && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">🧹 Dusting & Brushing</h3>
            <p>{dusting}</p>
            <button
              onClick={() => handleDone("Dusting & Brushing", dusting)}
              className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Mark as Done
            </button>
          </div>
        )}

        {laundry && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">👕 Laundry</h3>
            <p>{laundry}</p>
            <button
              onClick={() => handleDone("Laundry", laundry)}
              className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Mark as Done
            </button>
          </div>
        )}
      </div>

      {/* TOMORROW */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">🔮 Tomorrow's Preview</h2>
        <div className="bg-gray-700 rounded-2xl p-4 text-left shadow-lg">
          {moppingTomorrow && <p>🧽 Mopping: {moppingTomorrow}</p>}
          {dustingTomorrow && <p>🧹 Dusting & Brushing: {dustingTomorrow}</p>}
          {laundryTomorrow && <p>👕 Laundry: {laundryTomorrow}</p>}
        </div>
      </div>

      {/* HISTORY */}
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">📜 History Log</h2>
          <button
            onClick={clearHistory}
            className="px-3 py-1 text-sm bg-red-500 rounded-lg hover:bg-red-600"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-700 rounded-2xl p-4 text-left h-48 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-400">No tasks completed yet.</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="border-b border-gray-600 py-1">
                <p>
                  <strong>{item.task}</strong> by {item.person}
                </p>
                <span className="text-xs text-gray-400">
                  {item.date} at {item.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        Made with ❤️ for Akshara, Priyanka & Divya
      </footer>
    </div>
  );
}
