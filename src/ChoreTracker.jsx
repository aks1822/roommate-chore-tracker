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
  // (Mopping = Akshara, Laundry = Divya, Dusting = Priyanka)
  const BASE = new Date("2025-10-19T00:00:00");
  const dayDiff = Math.floor((stripTime(selectedDate) - stripTime(BASE)) / 86400000);
  const dow = selectedDate.getDay(); // 0 = Sun … 6 = Sat

  function stripTime(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  // ---------- Chore Logic ----------

  // 🧽 Mopping — Sundays only (A → P → D)
  const mopping = dow === 0 ? getPerson(Math.floor(dayDiff / 7)) : null;

  // 👕 Laundry — Daily (start Divya = index 2)
  const laundry = getPerson(2 + dayDiff);

  // 🧹 Dusting & Brushing — Sun/Tue/Thu/Sat (start Priyanka)
  const dusting = getDustingAssignee(dayDiff, dow);
  function getDustingAssignee(d, dayOfWeek) {
    const dustDays = [0, 2, 4, 6]; // Sun, Tue, Thu, Sat
    if (!dustDays.includes(dayOfWeek)) return null;

    // Count how many dust days since base
    let count = 0;
    for (let k = 0; k <= d; k++) {
      const kDow = (0 + k) % 7;
      if (dustDays.includes(kDow)) count++;
    }
    const startDustIdx = 1; // Priyanka
    return getPerson(startDustIdx + (count - 1));
  }

  // ---------- Styles ----------
  const calendarStyle = `
    .react-calendar {
      background-color:#1f2937;
      color:#fff;
      border:none;
      border-radius:1rem;
      padding:1rem;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
    }
    .react-calendar__tile {
      background:none;
      color:#fff;
      border-radius:0.5rem;
      text-align: center;
    }
    .react-calendar__tile--now {
      background:#374151;
      color:#fff;
    }
    .react-calendar__tile--active {
      background:#4f46e5!important;
      color:#fff!important;
    }
    .react-calendar__navigation {
      display:flex;
      justify-content:center;
      margin-bottom:0.5rem;
    }
    .react-calendar__navigation button {
      color:#fff;
      background:none;
      font-weight:600;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration:none;
    }
  `;

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <style>{calendarStyle}</style>

      <h1 className="text-4xl font-bold mb-6">🏡 Roommate Chore Tracker</h1>

      {/* Calendar */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg mb-6 flex flex-col items-center justify-center">
        <Calendar onChange={setSelectedDate} value={selectedDate} className="rounded-lg" />
      </div>

      <h2 className="text-2xl font-semibold mb-6">
        Selected Day: {selectedDate.toDateString()}
      </h2>

      {/* Chore cards */}
      <div className="flex flex-col gap-4 items-center justify-center w-full max-w-md">
        {mopping && (
          <div className="bg-gray-700 rounded-2xl p-5 shadow-lg w-72 text-center">
            <h3 className="text-lg font-semibold mb-1">🧽 Mopping</h3>
            <p>{mopping}</p>
          </div>
        )}

        {dusting && (
          <div className="bg-gray-700 rounded-2xl p-5 shadow-lg w-72 text-center">
            <h3 className="text-lg font-semibold mb-1">🧹 Dusting & Brushing</h3>
            <p>{dusting}</p>
          </div>
        )}

        {laundry && (
          <div className="bg-gray-700 rounded-2xl p-5 shadow-lg w-72 text-center">
            <h3 className="text-lg font-semibold mb-1">👕 Laundry</h3>
            <p>{laundry}</p>
          </div>
        )}
      </div>

      <footer className="mt-10 text-gray-400 text-sm text-center">
        Made with ❤️ for Akshara, Priyanka & Divya
      </footer>
    </div>
  );
}
