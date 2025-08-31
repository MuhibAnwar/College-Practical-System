"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function AddStudentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({
    name: "",
    roll: "",
    className: "",
    contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting student:", student);

    try {
      await addDoc(collection(db, "students"), {
        ...student,
        createdAt: serverTimestamp(),
      });

      alert("✅ Student added successfully!");
      router.push("/add-student");
    } catch (err) {
      console.error("❌ Error saving student:", err);
      alert("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={student.name}
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 border rounded bg-blue-100"
        />
        <input
          name="roll"
          value={student.roll}
          placeholder="Roll Number"
          onChange={handleChange}
          className="w-full p-2 border rounded bg-blue-100"
        />
      <select
  name="className"
  onChange={handleChange}
  value={student.className}
  className="w-full p-2 border rounded bg-blue-100"
>
  <option value="">Select Class</option>
  <option value="XI">XI</option>
  <option value="XII">XII</option>
  <option value="First Year">First Year</option>
  <option value="Second Year">Second Year</option>
</select>

        <input
          name="contact"
          value={student.contact}
          placeholder="Contact Number"
          onChange={handleChange}
          className="w-full p-2 border rounded bg-blue-100"
        />
        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            loading ? "bg-red-500" : "bg-blue-800 hover:bg-red-700"
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
