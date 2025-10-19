import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ChoreTracker() {
  // Rotation order (fixed)
  const roommates = ["Akshara", "Priyanka", "Divya"];

  // Calendar-selected day (defaults to today)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ---------- Helpers ----------
  const mod = (n, m) => ((n % m) + m) % m;
  const getPerson = (idx) => roommates[mod(idx, roommates.length)];

  // We lock-in "today" = Day 0 => Sunday 2025-10-19
  // (Mopping: Akshara today; Laundry: Divya today; Dusting starts tomorrow with Priyanka)
  const BASE = new Date("2025-10-19T00:00:00"); // local midnight
  const dayDiff = Math.floor((stripTime(selectedDate) - stripTime(BASE)) / 86400000);
  const dow = selectedDate.getDay(); // 0=Sun..6=Sat

  // Remove time-of-day
  function stripTime(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  // ---------- Chore logic ----------
  // 🧽 Mopping — Sundays only. Week index = floor(dayDiff/7); start at Akshara
  const mopping =
    dow === 0 ? getPerson(Math.floor(dayDiff / 7) /* 0->A, 1->P, 2->D... */) : null;

  // 👕 Laundry — Daily. Start today with Divya (index 2), then A (0), P (1)...
  const startLaundryIdx = 2; // Divya
  const laundry = getPerson(startLaundryIdx + dayDiff);

  // 🧹 Dusting — Every other day starting tomorrow (dayDiff = 1), skip Sundays.
  // We count ONLY actual dusting days (odd offsets that are NOT Sundays), so Sundays don’t advance the rotation.
  const dusting = getDustingAssignee(dayDiff, dow);

  function getDustingAssignee(d, dayOfWeek) {
    // No dusting before tomorrow; none on Sundays
    if (d < 1 || dayOfWeek === 0) return null;
    // Dusting happens on odd offsets only (1,3,5,...) relative to base
    if (d % 2 === 0) return null;

    // Count how many dusting days have occurred from day 1 up to day d (inclusive),
    // but skip any that land on Sundays (offsets 7, 21, 35, ...).
    // We’ll just iterate in steps of 2 (cheap, at most ~15 loops per month).
    let count = 0;
    for (let k = 1; k <= d; k += 2) {
      const kDow = (0 + k) % 7; // base was Sunday (0), so offset k has weekday k % 7
      if (kDow !== 0) count++; // count only non-Sunday dusting occurrences
    }
    // The assignee for day d is the (count-1)-th dusting occurrence.
    // Dusting starts with Priyanka on day 1, then Divya, then Akshara, repeating.
    const startDustIdx = 1; // Priyanka
    return getPerson(startDustIdx + (count - 1));
  }

  // ---------- UI helpers ----------
  const handleDone = (task, person) => {
    const entry = {
      date: selectedDate.toDateString(),
      task,
      person,
      time: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [entry, ...prev]);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all history?")) {
      setHistory([]);
      localStorage.removeItem("choreHistory");
    }
  };

  // Dark theme styles for react-calendar
  const calendarStyle = `
    .react-calendar { background-color:#1f2937; color:#fff; border:none; border-radius:1rem; padding:1rem; }
    .react-calendar__tile { background:none; color:#fff; border-radius:0.5rem; }
    .react-calendar__tile--now { background:#374151; color:#fff; }
    .react-calendar__tile--active { background:#4f46e5 !important; color:#fff !important; }
    .react-calendar__navigation button { color:#fff; background:none; font-weight:600; }
    .react-calendar__month-view__weekdays__weekday abbr { text-decoration:none; }
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 text-white p-6">
      <style>{calendarStyle}</style>
      <h1 className="text-3xl font-bold mb-4">🏡 Roommate Chore Tracker</h1>

      {/* Calendar */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-lg mb-6">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="rounded-lg"
        />
      </div>

      <h2 className="text-xl mb-6">Selected Day: {selectedDate.toDateString()}</h2>

      {/* Chore cards for the selected day */}
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

      <footer className="mt-8 text-gray-400 text-sm">
        Made with ❤️ for Akshara, Priyanka & Divya
      </footer>
    </div>
  );
}
