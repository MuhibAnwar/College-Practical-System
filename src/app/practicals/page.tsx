"use client";

import { useState } from "react";
import Link from "next/link";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

// ✅ Define types
type Student = {
  id: string;
  name: string;
  roll: string;
  className?: string;
  contact?: string;
};

type SubmissionStatus = "Submitted" | "Missing" | "Late";

type SubmissionMap = {
  [studentId: string]: SubmissionStatus;
};

export default function SubmissionsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionMap>({});
  const [subject, setSubject] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // ✅ Fetch Students
  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    const list: Student[] = snapshot.docs
      .map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name || "",
          roll: data.roll || "",
          className: data.className || "",
          contact: data.contact || "",
        };
      })
      .sort((a, b) => a.roll.localeCompare(b.roll)); // Sort by roll number

    setStudents(list);
  };

  // ✅ Generate table
  const handleMakeTable = () => {
    if (!subject || !date) {
      alert("Please fill in both subject and date first.");
      return;
    }
    fetchStudents();
    setShowTable(true);
  };

  // ✅ Save submissions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        subject,
        detail,
        date,
        createdAt: serverTimestamp(),
        students: students.map((s) => ({
          id: s.id,
          name: s.name,
          roll: s.roll,
          status: submissions[s.id] || "Missing",
        })),
      };

      await addDoc(collection(db, "submissions"), payload);
      alert("✅ Submissions saved!");
      setSubject("");
      setDetail("");
      setDate("");
      setSubmissions({});
      setShowTable(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-700">📂 Record Submissions</h1>
        <Link
          href="/submissions-records"
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
        >
          📄 View Past Submissions
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow p-6 rounded-lg mb-8"
      >
        <input
          type="text"
          placeholder="Subject (e.g. Physics Practical)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Optional Detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="button"
          onClick={handleMakeTable}
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          📋 Make Submission Table
        </button>

        {showTable && (
          <>
            <div className="bg-white shadow p-6 rounded-lg mt-6">
              <h2 className="text-xl font-semibold mb-4 text-red-700">
                Student List
              </h2>
              <table className="w-full text-left">
                <thead className="bg-red-700 text-white">
                  <tr>
                    <th className="p-2">Roll No</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="p-2">{s.roll}</td>
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">
                        <select
                          value={submissions[s.id] || "Missing"}
                          onChange={(e) =>
                            setSubmissions((prev) => ({
                              ...prev,
                              [s.id]: e.target.value as SubmissionStatus,
                            }))
                          }
                          className="p-1 border rounded"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Missing">Missing</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-blue-800 text-white py-2 rounded hover:bg-blue-900 transition"
            >
              {saving ? "Saving..." : "💾 Save Submissions"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
