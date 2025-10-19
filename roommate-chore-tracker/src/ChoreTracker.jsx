import React, { useState, useEffect } from "react";

export default function ChoreTracker() {
  const roommates = ["Akshara", "Roommate 2", "Roommate 3"];
  const [today, setToday] = useState(new Date());
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("choreHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("choreHistory", JSON.stringify(history));
  }, [history]);

  // Helper to calculate whose turn it is
  const getPerson = (startDateStr, frequency = "daily", dayFilter = null, offset = 0) => {
    const startDate = new Date(startDateStr);
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + offset);

    const diffDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

    if (frequency === "alternate") {
      const index = diffDays % roommates.length;
      return roommates[index];
    }

    if (frequency === "weekly" && currentDate.getDay() === dayFilter) {
      const weekNumber = Math.floor(diffDays / 7);
      const index = weekNumber % roommates.length;
      return roommates[index];
    }

    if (frequency === "daily") {
      const index = diffDays % roommates.length;
      return roommates[index];
    }

    return null;
  };

  // Base start date (first day of chores)
  const baseStart = "2025-10-01";

  // Today’s tasks
  const dustBrush = getPerson(baseStart, "alternate");
  const brushMop = getPerson(baseStart, "weekly", 0); // Sunday
  const laundry = getPerson(baseStart, "daily");

  // Tomorrow’s preview
  const dustBrushTomorrow = getPerson(baseStart, "alternate", null, 1);
  const brushMopTomorrow = getPerson(baseStart, "weekly", 0, 1);
  const laundryTomorrow = getPerson(baseStart, "daily", null, 1);

  // Mark task done
  const handleDone = (task, person) => {
    const newEntry = {
      date: today.toDateString(),
      task,
      person,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [...prev, newEntry]);
  };

  // Clear history
  const clearHistory = () => {
    if (window.confirm("Clear all history?")) {
      setHistory([]);
      localStorage.removeItem("choreHistory");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🏡 Roommate Chore Tracker</h1>
      <h2 className="text-xl mb-6">Today: {today.toDateString()}</h2>

      {/* Today’s chores */}
      <div className="grid gap-4 w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h3 className="text-lg font-semibold">🧹 Dusting & Brushing</h3>
          <p>{dustBrush}</p>
          <button
            onClick={() => handleDone("Dusting & Brushing", dustBrush)}
            className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Mark as Done
          </button>
        </div>

        {today.getDay() === 0 && (
          <div className="bg-white shadow-lg rounded-2xl p-4">
            <h3 className="text-lg font-semibold">🧽 Brushing & Mopping (Sunday)</h3>
            <p>{brushMop}</p>
            <button
              onClick={() => handleDone("Brushing & Mopping", brushMop)}
              className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Mark as Done
            </button>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h3 className="text-lg font-semibold">👕 Laundry</h3>
          <p>{laundry}</p>
          <button
            onClick={() => handleDone("Laundry", laundry)}
            className="mt-2 px-4 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Mark as Done
          </button>
        </div>
      </div>

      {/* Tomorrow’s preview */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">🔮 Tomorrow's Preview</h2>
        <div className="bg-white shadow rounded-2xl p-4 text-left">
          <p>🧹 Dusting & Brushing: {dustBrushTomorrow}</p>
          {brushMopTomorrow && <p>🧽 Brushing & Mopping: {brushMopTomorrow}</p>}
          <p>👕 Laundry: {laundryTomorrow}</p>
        </div>
      </div>

      {/* History Log */}
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">📜 History Log</h2>
          <button
            onClick={clearHistory}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Clear
          </button>
        </div>
        <div className="bg-white shadow rounded-2xl p-4 text-left h-48 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-500">No tasks completed yet.</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="border-b py-1">
                <p>
                  <strong>{item.task}</strong> by {item.person}
                </p>
                <span className="text-xs text-gray-500">
                  {item.date} at {item.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="mt-8 text-gray-500 text-sm">
        Made with ❤️ for roommates
      </footer>
    </div>
  );
}
