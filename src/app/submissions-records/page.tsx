"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function SubmissionsRecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusEdits, setStatusEdits] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(query(collection(db, "submissions"), orderBy("date", "desc")));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this record?");
    if (!confirm) return;
    await deleteDoc(doc(db, "submissions", id));
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEditToggle = (id: string) => {
    setEditingId(id === editingId ? null : id);
  };

  const handleStatusChange = (recordId: string, studentId: string, value: string) => {
    setStatusEdits((prev: any) => ({
      ...prev,
      [recordId]: {
        ...(prev[recordId] || {}),
        [studentId]: value,
      },
    }));
  };

  const handleSaveEdit = async (record: any) => {
    const updatedStudents = record.students.map((s: any) => ({
      ...s,
      status: statusEdits[record.id]?.[s.id] || s.status,
    }));
    await updateDoc(doc(db, "submissions", record.id), {
      students: updatedStudents,
    });
    setEditingId(null);
    window.location.reload();
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">📄 Past Submissions Records</h1>
      {records.map((record) => (
        <div key={record.id} className="bg-white shadow rounded-lg mb-8 p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold">📚 {record.subject}</p>
              <p className="text-sm text-gray-600">🗓️ {record.date} | 📝 {record.detail}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditToggle(record.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                {editingId === record.id ? "Cancel Edit" : "Edit"}
              </button>
              <button
                onClick={() => handleDelete(record.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-2">Roll No</th>
                <th className="p-2">Name</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {record.students.map((s: any) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.roll}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">
                    {editingId === record.id ? (
                      <select
                        value={statusEdits[record.id]?.[s.id] || s.status}
                        onChange={(e) => handleStatusChange(record.id, s.id, e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Missing">Missing</option>
                        <option value="Late">Late</option>
                      </select>
                    ) : (
                      <span>{s.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingId === record.id && (
            <div className="mt-4 text-right">
              <button
                onClick={() => handleSaveEdit(record)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
