import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ChoreTracker() {
  const roommates = ["Akshara", "Priyanka", "Divya"];
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("choreHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("choreHistory", JSON.stringify(history));
  }, [history]);

  // Helper: rotate through roommates
  const getPerson = (indexOffset = 0) =>
    roommates[(indexOffset % roommates.length + roommates.length) % roommates.length];

  // Base date: today = day 0 (Sun, Oct 19 2025)
  const baseDate = new Date("2025-10-19");
  const diffDays = Math.floor(
    (selectedDate - baseDate) / (1000 * 60 * 60 * 24)
  );
  const dayOfWeek = selectedDate.getDay();

  // --- Chore Logic ---
  // 🧽 Mopping (every Sunday, starts Akshara)
  const mopping = dayOfWeek === 0 ? getPerson(Math.floor(diffDays / 7)) : null;

  // 👕 Laundry (daily, starts Divya)
  const laundry = getPerson(diffDays - 1);

  // 🧹 Dusting (every alternate day starting tomorrow, Priyanka)
  const dusting =
    dayOfWeek !== 0 && diffDays % 2 === 1 ? getPerson(diffDays) : null;

  // --- History Handling ---
  const handleDone = (task, person) => {
    const newEntry = {
      date: selectedDate.toDateString(),
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

  // --- Dark theme calendar style fix ---
  const calendarStyle = `
    .react-calendar {
      background-color: #1f2937;
      color: white;
      border: none;
      border-radius: 1rem;
      padding: 1rem;
    }
    .react-calendar__tile {
      background: none;
      color: white;
      border-radius: 0.5rem;
    }
    .react-calendar__tile--now {
      background: #374151;
      color: #fff;
    }
    .react-calendar__tile--active {
      background: #4f46e5 !important;
      color: #fff !important;
    }
    .react-calendar__navigation button {
      color: white;
      background: none;
      font-weight: bold;
    }
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 text-center">
      <style>{calendarStyle}</style>

      <h1 className="text-3xl font-bold mb-4">🏡 Roommate Chore Tracker</h1>

      {/* Calendar */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-lg mb-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="rounded-lg text-black"
        />
      </div>

      <h2 className="text-xl mb-6">
        Selected Day: {selectedDate.toDateString()}
      </h2>

      {/* Chore Cards */}
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
