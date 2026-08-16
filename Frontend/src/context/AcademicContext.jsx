import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AcademicContext = createContext();

const STUDENT_STORAGE_KEY = "lms_students";
const ATTENDANCE_STORAGE_KEY = "lms_attendance";

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

const initialAttendanceData = [
  {
    studentId: 1,
    attendance: [
      {
        date: "2026-08-11",
        status: "Present",
        time: "08:45 AM",
        checkInTime: "08:45 AM",
        checkOutTime: "04:30 PM",
      },
      {
        date: "2026-08-10",
        status: "Present",
        time: "08:52 AM",
        checkInTime: "08:52 AM",
        checkOutTime: "04:30 PM",
      },
      {
        date: "2026-08-09",
        status: "Late",
        time: "09:18 AM",
        checkInTime: "09:18 AM",
        checkOutTime: "04:35 PM",
      },
    ],
  },
  {
    studentId: 2,
    attendance: [
      {
        date: "2026-08-11",
        status: "Absent",
        time: "--:--",
        checkInTime: "--:--",
        checkOutTime: "--:--",
      },
      {
        date: "2026-08-10",
        status: "Present",
        time: "08:48 AM",
        checkInTime: "08:48 AM",
        checkOutTime: "04:30 PM",
      },
      {
        date: "2026-08-09",
        status: "Present",
        time: "08:55 AM",
        checkInTime: "08:55 AM",
        checkOutTime: "04:25 PM",
      },
    ],
  },
  {
    studentId: 3,
    attendance: [
      {
        date: "2026-08-11",
        status: "Present",
        time: "08:50 AM",
        checkInTime: "08:50 AM",
        checkOutTime: "04:30 PM",
      },
      {
        date: "2026-08-10",
        status: "Present",
        time: "08:47 AM",
        checkInTime: "08:47 AM",
        checkOutTime: "04:30 PM",
      },
      {
        date: "2026-08-09",
        status: "Present",
        time: "08:51 AM",
        checkInTime: "08:51 AM",
        checkOutTime: "04:30 PM",
      },
    ],
  },
];

export const AcademicProvider = ({ children }) => {
  // --- Student State ---
  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialStudentData;
  });

  useEffect(() => {
    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
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

  // --- Batch State ---
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState(null);

  const fetchBatches = async () => {
    setBatchesLoading(true);
    try {
      const response = await api.get("/batches");
      if (response.data.success) {
        setBatches(response.data.batches);
      }
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      setBatchesError(err.response?.data?.message || "Failed to fetch batches");
    } finally {
      setBatchesLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const addBatch = async (newBatch) => {
    setBatchesLoading(true);
    try {
      const payload = {
        batchName: newBatch.batchName || newBatch.name,
        program: newBatch.program || newBatch.code,
        startDate: newBatch.startDate,
        endDate: newBatch.endDate,
        status: newBatch.status || "active",
      };

      const response = await api.post("/batches", payload);
      if (response.data.success) {
        setBatches((prev) => [response.data.batch, ...prev]);
      }
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to add batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to create batch");
    } finally {
      setBatchesLoading(false);
    }
  };

  const updateBatch = async (id, updatedData) => {
    setBatchesLoading(true);
    try {
      const payload = {
        batchName: updatedData.batchName || updatedData.name,
        program: updatedData.program || updatedData.code,
        startDate: updatedData.startDate,
        endDate: updatedData.endDate,
        status: updatedData.status,
      };

      const response = await api.put(`/batches/${id}`, payload);
      if (response.data.success) {
        setBatches((prev) =>
          prev.map((b) => (b._id === id ? response.data.batch : b))
        );
      }
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to update batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to update batch");
    } finally {
      setBatchesLoading(false);
    }
  };

  const deleteBatch = async (id) => {
    setBatchesLoading(true);
    try {
      const response = await api.delete(`/batches/${id}`);
      if (response.data.success) {
        setBatches((prev) => prev.filter((b) => b._id !== id));
      }
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to delete batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to delete batch");
    } finally {
      setBatchesLoading(false);
    }
  };

  // --- Attendance State ---
  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialAttendanceData;
  });

  useEffect(() => {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
  }, [attendance]);

  const updateAttendance = (studentId, date, status, time, checkOutTime = null) => {
    setAttendance((prev) => {
      const studentExists = prev.some(
        (student) => student.studentId === studentId || student.id === studentId
      );

      if (!studentExists) {
        return [
          ...prev,
          {
            studentId,
            attendance: [
              {
                date,
                status,
                time: time || "--:--",
                checkInTime: time || "--:--",
                checkOutTime: checkOutTime || "--:--",
              },
            ],
          },
        ];
      }

      return prev.map((student) => {
        if (student.studentId !== studentId && student.id !== studentId) {
          return student;
        }

        const existingAttendance = student.attendance?.find(
          (item) => item.date === date
        );

        if (existingAttendance) {
          return {
            ...student,
            attendance: student.attendance.map((item) =>
              item.date === date
                ? {
                    ...item,
                    status,
                    time: time || item.time || "--:--",
                    checkInTime: time || item.checkInTime || item.time || "--:--",
                    checkOutTime: checkOutTime !== null ? checkOutTime : item.checkOutTime || "--:--",
                  }
                : item
            ),
          };
        }

        return {
          ...student,
          attendance: [
            ...(student.attendance || []),
            {
              date,
              status,
              time: time || "--:--",
              checkInTime: time || "--:--",
              checkOutTime: checkOutTime || "--:--",
            },
          ],
        };
      });
    });
  };

  const getStudentAttendance = (studentId) => {
    return (
      attendance.find(
        (student) => student.studentId === studentId || student.id === studentId
      )?.attendance || []
    );
  };

  return (
    <AcademicContext.Provider
      value={{
        // Student slice
        students,
        setStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        // Batch slice
        batches,
        setBatches,
        batchesLoading,
        batchesError,
        fetchBatches,
        addBatch,
        updateBatch,
        deleteBatch,
        // Attendance slice
        attendance,
        setAttendance,
        updateAttendance,
        getStudentAttendance,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademic must be used inside AcademicProvider");
  }
  return context;
};

// Thin exported compatibility wrappers
export const useStudents = () => {
  const { students, setStudents, addStudent, updateStudent, deleteStudent } = useAcademic();
  return { students, setStudents, addStudent, updateStudent, deleteStudent };
};

export const useStudent = useStudents;

export const useBatches = () => {
  const {
    batches,
    setBatches,
    batchesLoading: loading,
    batchesError: error,
    fetchBatches,
    addBatch,
    updateBatch,
    deleteBatch,
  } = useAcademic();
  return { batches, setBatches, loading, error, fetchBatches, addBatch, updateBatch, deleteBatch };
};

export const useBatch = useBatches;

export const useAttendance = () => {
  const { attendance, setAttendance, updateAttendance, getStudentAttendance } = useAcademic();
  return { attendance, setAttendance, updateAttendance, getStudentAttendance };
};
