"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

type Student = {
  id: string;
  name: string;
  roll: string;
  className: string;
  contact: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("roll"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Student[];
      setStudents(data);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    const yes = window.confirm("Are you sure you want to delete this student?");
    if (!yes) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "students", id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      const { id, ...payload } = editing;
      await updateDoc(doc(db, "students", id), payload);
      setEditing(null);
    } catch (e) {
      console.error(e);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-6">📚 Student Records (Ranked by Roll No)</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Name</th>
              <th className="p-3">Roll No</th>
              <th className="p-3">Class</th>
              <th className="p-3">Contact</th>
            </tr>
          </thead>
          <tbody>
            {students.length ? (
              students.map((s, i) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium text-gray-900">{s.name}</td>
                  <td
                    className="p-3 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setEditing(s)}
                  >
                    {s.roll}
                  </td>
              <td className="p-3">
  {s.className === "Class 1" ? "XI" : s.className}
</td>

                  <td className="p-3">{s.contact}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No student records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-700">Edit Student</h2>
            <div className="space-y-3">
              <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Input label="Roll No" value={editing.roll} onChange={(v) => setEditing({ ...editing, roll: v })} />
              <Input label="Class" value={editing.className} onChange={(v) => setEditing({ ...editing, className: v })} />
              <Input label="Contact" value={editing.contact} onChange={(v) => setEditing({ ...editing, contact: v })} />
            </div>
            <div className="mt-6 flex justify-between gap-3">
              <button
                onClick={() => handleDelete(editing.id)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                disabled={deletingId === editing.id}
              >
                {deletingId === editing.id ? "Deleting..." : "Delete"}
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </label>
  );
}
