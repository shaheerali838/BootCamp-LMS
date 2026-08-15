import React, { createContext, useContext, useState, useEffect } from "react";

const StudentContext = createContext();

const STORAGE_KEY = "lms_students";

const initialStudentData = [
  {
    id: 1,
    rollNo: "SMIT-001",
    name: "Ayesha Siddiqui",
    initials: "AS",
    email: "ayesha@smit.edu",
    phone: "0300-1111111",
    team: "Team Alpha",
    attendance: 92,
    status: "Active",
  },
  {
    id: 2,
    rollNo: "SMIT-002",
    name: "Bilal Ahmed",
    initials: "BA",
    email: "bilal@smit.edu",
    phone: "0300-2222222",
    team: "Team Beta",
    attendance: 78,
    status: "Active",
  },
  {
    id: 3,
    rollNo: "SMIT-003",
    name: "Fatima Malik",
    initials: "FM",
    email: "fatima@smit.edu",
    phone: "0300-3333333",
    team: "Team Alpha",
    attendance: 96,
    status: "Active",
  },
  {
    id: 4,
    rollNo: "SMIT-004",
    name: "Hamza Khan",
    initials: "HK",
    email: "hamza@smit.edu",
    phone: "0300-4444444",
    team: "Team Gamma",
    attendance: 65,
    status: "At Risk",
  },
  {
    id: 5,
    rollNo: "SMIT-005",
    name: "Zara Hussain",
    initials: "ZH",
    email: "zara@smit.edu",
    phone: "0300-5555555",
    team: "Team Beta",
    attendance: 88,
    status: "Active",
  },
  {
    id: 6,
    rollNo: "SMIT-006",
    name: "Usman Tariq",
    initials: "UT",
    email: "usman@smit.edu",
    phone: "0300-6666666",
    team: "Team Delta",
    attendance: 84,
    status: "Active",
  },
  {
    id: 7,
    rollNo: "SMIT-007",
    name: "Nadia Qureshi",
    initials: "NQ",
    email: "nadia@smit.edu",
    phone: "0300-7777777",
    team: "Team Gamma",
    attendance: 91,
    status: "Active",
  },
  {
    id: 8,
    rollNo: "SMIT-008",
    name: "Hassan Raza",
    initials: "HR",
    email: "hassan@smit.edu",
    phone: "0300-8888888",
    team: "Team Delta",
    attendance: 69,
    status: "At Risk",
  },
];

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialStudentData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = (newStudent) => {
    setStudents((prev) => [...prev, { ...newStudent, id: Date.now() }]);
  };

  const updateStudent = (id, updatedData) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        addStudent,
        updateStudent,
        deleteStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used inside StudentProvider");
  }
  return context;
};

export const useStudents = useStudent;
