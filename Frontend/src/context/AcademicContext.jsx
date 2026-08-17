import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AcademicContext = createContext();

// ── Static local attendance data (no backend route) ───────
const initialAttendanceData = [];

export const AcademicProvider = ({ children }) => {
  // ── Students (API) ─────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  const fetchStudents = async () => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("user");
    let userObj = null;
    try { userObj = JSON.parse(rawUser); } catch {}
    const role = (userObj?.role || "").toUpperCase();

    const isAuth = typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname.startsWith("/auth") || window.location.pathname === "/forgot-password");
    if (!token || isAuth || role === "STUDENT") return;

    setStudentsLoading(true);
    try {
      const res = await api.get("/students/get-all-students");
      setStudents(res.data.data || []);
      setStudentsError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setStudents([]);
        return;
      }
      console.error("Failed to fetch students:", err);
      setStudentsError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setStudentsLoading(false);
    }
  };

  const addStudent = async (newStudent) => {
    setStudentsLoading(true);
    try {
      const payload = {
        firstName: newStudent.firstName || newStudent.name?.split(" ")[0] || "",
        lastName: newStudent.lastName || newStudent.name?.split(" ").slice(1).join(" ") || "",
        rollNumber: newStudent.rollNumber || newStudent.rollNo || `SMIT-${Math.floor(1000 + Math.random() * 9000)}`,
        email: (newStudent.email || "").toLowerCase().trim(),
        password: newStudent.password || "Student@123",
        phoneNumber: newStudent.phoneNumber || newStudent.phone || "",
        gender: (newStudent.gender || "male").toLowerCase(),
        dateOfBirth: newStudent.dateOfBirth || "2002-01-01",
        batchId: newStudent.batchId || newStudent.batch,
        mentorId: newStudent.mentorId || newStudent.mentor,
        status: newStudent.status || "active",
      };
      const res = await api.post("/students/create-student", payload);
      if (res.data.success) setStudents((prev) => [res.data.data, ...prev]);
      setStudentsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add student:", err);
      setStudentsError(err.response?.data?.message || "Failed to create student");
      throw err;
    } finally {
      setStudentsLoading(false);
    }
  };

  const updateStudent = async (id, updatedData) => {
    setStudentsLoading(true);
    try {
      const payload = {
        firstName: updatedData.firstName || updatedData.name?.split(" ")[0],
        lastName: updatedData.lastName || updatedData.name?.split(" ").slice(1).join(" "),
        rollNumber: updatedData.rollNumber || updatedData.rollNo,
        email: updatedData.email ? updatedData.email.toLowerCase().trim() : undefined,
        phoneNumber: updatedData.phoneNumber || updatedData.phone,
        gender: updatedData.gender ? updatedData.gender.toLowerCase() : undefined,
        dateOfBirth: updatedData.dateOfBirth,
        batchId: updatedData.batchId || updatedData.batch,
        mentorId: updatedData.mentorId || updatedData.mentor,
        status: updatedData.status,
      };
      if (updatedData.password) {
        payload.password = updatedData.password;
      }
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      const res = await api.put(`/students/update-student/${id}`, payload);
      if (res.data.success) {
        setStudents((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      }
      setStudentsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update student:", err);
      setStudentsError(err.response?.data?.message || "Failed to update student");
      throw err;
    } finally {
      setStudentsLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    setStudentsLoading(true);
    try {
      await api.delete(`/students/delete-student/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setStudentsError(null);
    } catch (err) {
      console.error("Failed to delete student:", err);
      setStudentsError(err.response?.data?.message || "Failed to delete student");
      throw err;
    } finally {
      setStudentsLoading(false);
    }
  };

  // ── Batches (API) ─────────────────────────────────────────
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState(null);

  const fetchBatches = async () => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("user");
    let userObj = null;
    try { userObj = JSON.parse(rawUser); } catch {}
    const role = (userObj?.role || "").toUpperCase();

    const isAuth = typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname.startsWith("/auth") || window.location.pathname === "/forgot-password");
    if (!token || isAuth || role === "STUDENT") return;

    setBatchesLoading(true);
    try {
      const response = await api.get("/batches/get-all-batches");
      if (response.data.success) setBatches(response.data.batches || []);
      setBatchesError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setBatches([]);
        return;
      }
      console.error("Failed to fetch batches:", err);
      setBatchesError(err.response?.data?.message || "Failed to fetch batches");
    } finally {
      setBatchesLoading(false);
    }
  };

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
      const response = await api.post("/batches/create-batch", payload);
      if (response.data.success) setBatches((prev) => [response.data.batch, ...prev]);
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to add batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to create batch");
      throw err;
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
      const response = await api.put(`/batches/update-batch/${id}`, payload);
      if (response.data.success) {
        setBatches((prev) => prev.map((b) => (b._id === id ? response.data.batch : b)));
      }
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to update batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to update batch");
      throw err;
    } finally {
      setBatchesLoading(false);
    }
  };

  const deleteBatch = async (id) => {
    setBatchesLoading(true);
    try {
      const response = await api.delete(`/batches/delete-batch/${id}`);
      if (response.data.success) setBatches((prev) => prev.filter((b) => b._id !== id));
      setBatchesError(null);
    } catch (err) {
      console.error("Failed to delete batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to delete batch");
      throw err;
    } finally {
      setBatchesLoading(false);
    }
  };

  // ── Attendance (local) ─────────────────────────────────────
  const [attendance, setAttendance] = useState(initialAttendanceData);

  const updateAttendance = (studentId, date, status, time, checkOutTime = null) => {
    setAttendance((prev) => {
      const studentExists = prev.some((s) => s.studentId === studentId || s.id === studentId);
      if (!studentExists) {
        return [...prev, { studentId, attendance: [{ date, status, time: time || "--:--", checkInTime: time || "--:--", checkOutTime: checkOutTime || "--:--" }] }];
      }
      return prev.map((student) => {
        if (student.studentId !== studentId && student.id !== studentId) return student;
        const existing = student.attendance?.find((item) => item.date === date);
        if (existing) {
          return {
            ...student,
            attendance: student.attendance.map((item) =>
              item.date === date
                ? { ...item, status, time: time || item.time || "--:--", checkInTime: time || item.checkInTime || "--:--", checkOutTime: checkOutTime !== null ? checkOutTime : item.checkOutTime || "--:--" }
                : item
            ),
          };
        }
        return { ...student, attendance: [...(student.attendance || []), { date, status, time: time || "--:--", checkInTime: time || "--:--", checkOutTime: checkOutTime || "--:--" }] };
      });
    });
  };

  const getStudentAttendance = (studentId) =>
    attendance.find((s) => s.studentId === studentId || s.id === studentId)?.attendance || [];

  // ── Bootstrap ─────────────────────────────────────────────
  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  return (
    <AcademicContext.Provider
      value={{
        // Students
        students, studentsLoading, studentsError,
        setStudents, fetchStudents, addStudent, updateStudent, deleteStudent,
        // Batches
        batches, setBatches, batchesLoading, batchesError,
        fetchBatches, addBatch, updateBatch, deleteBatch,
        // Attendance (local)
        attendance, setAttendance, updateAttendance, getStudentAttendance,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) throw new Error("useAcademic must be used inside AcademicProvider");
  return context;
};

// ── Thin compatibility wrappers ───────────────────────────
export const useStudents = () => {
  const { students, studentsLoading, studentsError, setStudents, fetchStudents, addStudent, updateStudent, deleteStudent } = useAcademic();
  return { students, loading: studentsLoading, error: studentsError, setStudents, fetchStudents, addStudent, updateStudent, deleteStudent };
};
export const useStudent = useStudents;

export const useBatches = () => {
  const { batches, setBatches, batchesLoading: loading, batchesError: error, fetchBatches, addBatch, updateBatch, deleteBatch } = useAcademic();
  return { batches, setBatches, loading, error, fetchBatches, addBatch, updateBatch, deleteBatch };
};
export const useBatch = useBatches;

export const useAttendance = () => {
  const { attendance, setAttendance, updateAttendance, getStudentAttendance } = useAcademic();
  return { attendance, setAttendance, updateAttendance, getStudentAttendance };
};
