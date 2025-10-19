import React, { useState, useEffect } from "react";

export default function ChoreTracker() {
  // Rotation order
  const roommates = ["Akshara", "Priyanka", "Divya"];
  const [today, setToday] = useState(new Date());
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("choreHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Save history persistently
  useEffect(() => {
    localStorage.setItem("choreHistory", JSON.stringify(history));
  }, [history]);

  // Helper to calculate whose turn it is
  const getPerson = (
    startDateStr,
    frequency = "daily",
    dayFilter = null,
    offset = 0,
    shift = 0 // new: small rotation shift
  ) => {
    const startDate = new Date(startDateStr);
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + offset);

    const diffDays = Math.floor(
      (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // pick correct index with shift adjustment
    const pick = (num) => roommates[(num + shift + roommates.length) % roommates.length];

    if (frequency === "alternate") return pick(diffDays % roommates.length);
    if (frequency === "weekly" && currentDate.getDay() === dayFilter)
      return pick(Math.floor(diffDays / 7) % roommates.length);
    if (frequency === "daily") return pick(diffDays % roommates.length);

    return null;
  };

  // base start date for consistent indexing
  const baseStart = "2025-10-01";
  const dayOfWeek = today.getDay();

  // ---- Assign chores ----
  const dusting = dayOfWeek !== 0 ? getPerson(baseStart, "alternate", null, 0, 0) : null; // skip Sunday
  const mopping = dayOfWeek === 0 ? getPerson(baseStart, "weekly", 0, 0, -1) : null; // shift -1 so Akshara gets this week
  const laundry = getPerson(baseStart, "daily", null, 0, 1); // shift +1 so Divya today, Akshara tomorrow

  // Tomorrow preview
  const dustingTomorrow =
    dayOfWeek + 1 !== 0 ? getPerson(baseStart, "alternate", null, 1, 0) : null;
  const moppingTomorrow =
    (dayOfWeek + 1) % 7 === 0
      ? getPerson(baseStart, "weekly", 0, 1, -1)
      : null;
  const laundryTomorrow = getPerson(baseStart, "daily", null, 1, 1);

  // Mark done
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

      {/* Today’s chores */}
      <div className="grid gap-4 w-full max-w-md">
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

      {/* Tomorrow’s preview */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">🔮 Tomorrow's Preview</h2>
        <div className="bg-gray-700 rounded-2xl p-4 text-left shadow-lg">
          {dustingTomorrow && <p>🧹 Dusting & Brushing: {dustingTomorrow}</p>}
          {moppingTomorrow && <p>🧽 Mopping: {moppingTomorrow}</p>}
          {laundryTomorrow && <p>👕 Laundry: {laundryTomorrow}</p>}
        </div>
      </div>

      {/* History */}
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
