import { useState } from "react";

{/*export type Student = {
  id?: string;
  name: string;
  roll: string;
  className: string;
  contact: string;
  createdAt?: any; // Firestore Timestamp
};
type Student = {
  id: string;
  name: string;
  roll: string;
};

const [students, setStudents] = useState<Student[]>([]);
*/}
type Student = {
  id: string;
  name: string;
  roll: string;
  className: string;
  contact: string;
};

const [students, setStudents] = useState<Student[]>([]);
