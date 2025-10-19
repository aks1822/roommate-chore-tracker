import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ChoreTracker() {
  const roommates = ["Akshara", "Priyanka", "Divya"];
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ---------- Helpers ----------
  const mod = (n, m) => ((n % m) + m) % m;
  const getPerson = (idx) => roommates[mod(idx, roommates.length)];

  // Base reference: Sunday 2025-10-19 (Day 0)
  // (Mopping: Akshara, Laundry: Divya, Brushing: Priyanka)
  const BASE = new Date("2025-10-19T00:00:00");
  const dayDiff = Math.floor((stripTime(selectedDate) - stripTime(BASE)) / 86400000);
  const dow = selectedDate.getDay(); // 0=Sun..6=Sat

  function stripTime(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  // ---------- Chore Logic ----------

  // 🧽 Mopping — Sundays only, rotation: A → P → D
  const mopping = dow === 0 ? getPerson(Math.floor(dayDiff / 7)) : null;

  // 👕 Laundry — Daily, start with Divya (index 2)
  const laundry = getPerson(2 + dayDiff);

  // 🧹 Dusting — Every other day starting tomorrow (Mon 20 Oct), skip Sundays
  const dusting = getDustingAssignee(dayDiff, dow);

  function getDustingAssignee(d, dayOfWeek) {
    if (d < 1 || dayOfWeek === 0) return null;
    if (d % 2 === 0) return null;

    let count = 0;
    for (let k = 1; k <= d; k += 2) {
      const kDow = (0 + k) % 7;
      if (kDow !== 0) count++;
    }
    const startDustIdx = 1; // Priyanka
    return getPerson(startDustIdx + (count - 1));
  }

  // 🪥 Brushing — Every Sunday & Tuesday, starting with Priyanka
  const brushing = getBrushingAssignee(dayDiff, dow);

  function getBrushingAssignee(d, dayOfWeek) {
    if (dayOfWeek !== 0 && dayOfWeek !== 2) return null;

    let count = 0;
    for (let k = 0; k <= d; k++) {
      const kDow = (0 + k) % 7;
      if (kDow === 0 || kDow === 2) count++;
    }
    const startBrushIdx = 1; // Priyanka
    return getPerson(startBrushIdx + (count - 1));
  }

  // ---------- Styles ----------
  const calendarStyle = `
    .react-calendar {
      background-color: #1f2937;
      color: #fff;
      border: none;
      border-radius: 1rem;
      padding: 1rem;
    }
    .react-calendar__tile {
      background: none;
      color: #fff;
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
      color: #fff;
      background: none;
      font-weight: 600;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
    }
  `;

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 text-white p-6">
      <style>{calendarStyle}</style>
      <h1 className="text-3xl font-bold mb-4">🏡 Roommate Chore Tracker</h1>

      {/* Calendar */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow-lg mb-6">
        <Calendar onChange={setSelectedDate} value={selectedDate} className="rounded-lg" />
      </div>

      <h2 className="text-xl mb-6">Selected Day: {selectedDate.toDateString()}</h2>

      {/* Chore cards */}
      <div className="grid gap-4 w-full max-w-md">
        {mopping && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">🧽 Mopping</h3>
            <p>{mopping}</p>
          </div>
        )}

        {brushing && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">🪥 Brushing</h3>
            <p>{brushing}</p>
          </div>
        )}

        {dusting && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">🧹 Dusting & Brushing</h3>
            <p>{dusting}</p>
          </div>
        )}

        {laundry && (
          <div className="bg-gray-700 rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-semibold">👕 Laundry</h3>
            <p>{laundry}</p>
          </div>
        )}
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        Made with ❤️ for Akshara, Priyanka & Divya
      </footer>
    </div>
  );
}
