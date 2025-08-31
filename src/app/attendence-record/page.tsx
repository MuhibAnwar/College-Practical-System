"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
type StudentRecord = {
  id: string;
  name: string;
  roll: string;
  status: "Present" | "Absent" | "Leave";
};

type AttendanceRecord = {
  id: string;
  date: string;
  day: string;
  students: StudentRecord[];
};

export default function AttendanceRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
  setLoading(true);
  try {
    const snapshot = await getDocs(collection(db, "attendance"));
    const list: AttendanceRecord[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<AttendanceRecord, "id">; // 👈 type cast
      return { id: doc.id, ...data };
    });
    const filtered = filterDate
      ? list.filter((r) => r.date === filterDate)
      : list;
    setRecords(filtered);
  } catch (err) {
    console.error("Error fetching attendance records:", err);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this attendance record?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "attendance", id));
      setRecords((prev) => prev.filter((r) => r.id !== id));
      alert("Record deleted successfully.");
    } catch (err) {
      console.error("Error deleting attendance record:", err);
      alert("Failed to delete record.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-4">📅 Attendance Records</h1>

      <div className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={fetchRecords}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Filter
        </button>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <div className="space-y-6">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white shadow p-4 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-red-700">
                  📅 {record.date} ({record.day})
                </h2>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete Record
                </button>
              </div>
              <table className="w-full text-sm border">
                <thead className="bg-red-700 text-white">
                  <tr>
                    <th className="p-2">Roll No</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {record.students?.map((student: any, idx: number) => (
                    <tr key={student.id} className="border-b">
                      <td className="p-2">{student.roll}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.status}</td>
                      <td className="p-2">
                        <select
                          value={student.status}
                          onChange={async (e) => {
                            const updatedRecords = [...records];
                            updatedRecords.find((r) => r.id === record.id).students[idx].status = e.target.value;
                            setRecords(updatedRecords);
                            await updateDoc(doc(db, "attendance", record.id), {
                              ...record,
                              students: updatedRecords.find((r) => r.id === record.id).students,
                            });
                          }}
                          className="p-1 border rounded"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
