"use client";

import { useState } from "react";
import { db } from "../../lib/firebase";
import Link from "next/link";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

// ✅ Define the Student type
type Student = {
  id: string;
  name: string;
  roll: string;
  className: string;
  contact: string;
};

type AttendanceMap = {
  [studentId: string]: "Present" | "Absent";
};

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState({ date: "", day: "" });
  const [attendanceData, setAttendanceData] = useState<AttendanceMap>({});
  const [saving, setSaving] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // ✅ Generate Attendance Table
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance.date || !attendance.day) {
      alert("Please fill date and day.");
      return;
    }

    const snapshot = await getDocs(collection(db, "students"));
    const list: Student[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData; // safer cast
      return {
        id: doc.id,
        name: data.name || "",
        roll: data.roll || "",
        className: data.className || "",
        contact: data.contact || "",
      };
    });

    const sortedList = list.sort((a, b) => a.roll.localeCompare(b.roll));
    setStudents(sortedList);
    setShowTable(true);
  };

  // ✅ Save Attendance
  const handleSave = async () => {
    setSaving(true);
    try {
      const attendanceRecord = {
        ...attendance,
        createdAt: serverTimestamp(),
        students: students.map((s) => ({
          id: s.id,
          name: s.name,
          roll: s.roll,
          status: attendanceData[s.id] || "Absent",
        })),
      };

      await addDoc(collection(db, "attendance"), attendanceRecord);
      alert("✅ Attendance saved successfully!");
      setShowTable(false);
      setAttendance({ date: "", day: "" });
      setAttendanceData({});
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-700">📝 Attendance Page</h1>
        <Link
          href="/attendance-record"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          📅 View Past Records
        </Link>
      </div>

      {/* Form to make attendance */}
      <form onSubmit={handleGenerate} className="space-y-4 bg-white shadow p-6 rounded-lg mb-8">
        <input
          type="date"
          value={attendance.date}
          onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Day (e.g. Monday)"
          value={attendance.day}
          onChange={(e) => setAttendance({ ...attendance, day: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition"
        >
          Make Attendance
        </button>
      </form>

      {/* Table shown after form submission */}
      {showTable && (
        <div className="bg-white shadow p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            Attendance for {attendance.date} ({attendance.day})
          </h2>
          <table className="w-full text-left">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Present</th>
                <th className="p-2">Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.roll}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">
                    <input
                      type="radio"
                      name={`status-${s.id}`}
                      value="Present"
                      checked={attendanceData[s.id] === "Present"}
                      onChange={(e) =>
                        setAttendanceData((prev) => ({ ...prev, [s.id]: e.target.value as "Present" }))
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="radio"
                      name={`status-${s.id}`}
                      value="Absent"
                      checked={attendanceData[s.id] === "Absent" || !attendanceData[s.id]}
                      onChange={(e) =>
                        setAttendanceData((prev) => ({ ...prev, [s.id]: e.target.value as "Absent" }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {saving ? "Saving..." : "Save to Record"}
          </button>
        </div>
      )}
    </div>
  );
}
