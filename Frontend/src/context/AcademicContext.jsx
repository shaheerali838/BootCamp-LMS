import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const AcademicContext = createContext();

// ── Static local attendance data (no backend route) ───────
const initialAttendanceData = [];

export const AcademicProvider = ({ children }) => {
  const { accessToken, user } = useAuth();

  // ── Students (API) ─────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  const fetchStudents = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    const rawUser =
      user ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();
    const role = (rawUser?.role || "").toUpperCase();

    if (!token || role === "STUDENT") {
      if (role === "STUDENT") setStudents([]);
      return;
    }

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
      setStudentsError(
        err.response?.data?.message || "Failed to fetch students",
      );
    } finally {
      setStudentsLoading(false);
    }
  }, [accessToken, user]);

  const addStudent = async (newStudent) => {
    setStudentsLoading(true);
    try {
      let res;
      if (newStudent instanceof FormData) {
        res = await api.post("/students/create-student", newStudent, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const formData = new FormData();
        const bId = newStudent.batchId?._id || newStudent.batchId || newStudent.batch?._id || newStudent.batch;
        const mId = newStudent.mentorId?._id || newStudent.mentorId || newStudent.mentor?._id || newStudent.mentor;

        formData.append("firstName", newStudent.firstName || newStudent.name?.split(" ")[0] || "");
        formData.append("lastName", newStudent.lastName || newStudent.name?.split(" ").slice(1).join(" ") || "");
        formData.append("rollNumber", newStudent.rollNumber || newStudent.rollNo || `SMIT-${Math.floor(1000 + Math.random() * 9000)}`);
        formData.append("email", (newStudent.email || "").toLowerCase().trim());
        formData.append("password", newStudent.password || "Student@123");
        formData.append("phoneNumber", newStudent.phoneNumber || newStudent.phone || "");
        formData.append("gender", (newStudent.gender || "male").toLowerCase());
        formData.append("dateOfBirth", newStudent.dateOfBirth || "2002-01-01");
        if (bId) formData.append("batchId", bId);
        if (mId) formData.append("mentorId", mId);
        formData.append("status", newStudent.status || "active");
        if (newStudent.profilePicture) {
          formData.append("profilePicture", newStudent.profilePicture);
        }

        res = await api.post("/students/create-student", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // Invalidate and refetch authoritative student list from database
      await fetchStudents();
      setStudentsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add student:", err);
      setStudentsError(
        err.response?.data?.message || "Failed to create student",
      );
      throw err;
    } finally {
      setStudentsLoading(false);
    }
  };

  const updateStudent = async (id, updatedData) => {
    setStudentsLoading(true);
    try {
      let res;
      if (updatedData instanceof FormData) {
        res = await api.put(`/students/update-student/${id}`, updatedData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const formData = new FormData();
        const bId = updatedData.batchId?._id || updatedData.batchId || updatedData.batch?._id || updatedData.batch;
        const mId = updatedData.mentorId?._id || updatedData.mentorId || updatedData.mentor?._id || updatedData.mentor;

        if (updatedData.firstName) formData.append("firstName", updatedData.firstName);
        if (updatedData.lastName) formData.append("lastName", updatedData.lastName);
        if (updatedData.rollNumber || updatedData.rollNo) formData.append("rollNumber", updatedData.rollNumber || updatedData.rollNo);
        if (updatedData.email) formData.append("email", updatedData.email.toLowerCase().trim());
        if (updatedData.phoneNumber || updatedData.phone) formData.append("phoneNumber", updatedData.phoneNumber || updatedData.phone);
        if (updatedData.gender) formData.append("gender", updatedData.gender.toLowerCase());
        if (updatedData.dateOfBirth) formData.append("dateOfBirth", updatedData.dateOfBirth);
        if (bId) formData.append("batchId", bId);
        if (mId) formData.append("mentorId", mId);
        if (updatedData.status) formData.append("status", updatedData.status);
        if (updatedData.password) formData.append("password", updatedData.password);
        if (updatedData.profilePicture) formData.append("profilePicture", updatedData.profilePicture);

        res = await api.put(`/students/update-student/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // Invalidate and refetch authoritative student list from database
      await fetchStudents();
      setStudentsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update student:", err);
      setStudentsError(
        err.response?.data?.message || "Failed to update student",
      );
      throw err;
    } finally {
      setStudentsLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    setStudentsLoading(true);
    try {
      await api.delete(`/students/delete-student/${id}`);
      // Invalidate and refetch authoritative student list from database
      await fetchStudents();
      setStudentsError(null);
    } catch (err) {
      console.error("Failed to delete student:", err);
      setStudentsError(
        err.response?.data?.message || "Failed to delete student",
      );
      throw err;
    } finally {
      setStudentsLoading(false);
    }
  };

  // ── Batches (API) ─────────────────────────────────────────
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchesError, setBatchesError] = useState(null);

  const fetchBatches = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    const rawUser =
      user ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();
    const role = (rawUser?.role || "").toUpperCase();

    if (!token || role === "STUDENT") {
      if (role === "STUDENT") setBatches([]);
      return;
    }

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
  }, [accessToken, user]);

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
      // Invalidate and refetch authoritative batch list from database
      await fetchBatches();
      setBatchesError(null);
      return response.data;
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
      // Invalidate and refetch authoritative batch list from database
      await fetchBatches();
      setBatchesError(null);
      return response.data;
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
      // Invalidate and refetch authoritative batch list from database
      await fetchBatches();
      setBatchesError(null);
      return response.data;
    } catch (err) {
      console.error("Failed to delete batch:", err);
      setBatchesError(err.response?.data?.message || "Failed to delete batch");
      throw err;
    } finally {
      setBatchesLoading(false);
    }
  };

  // ── Attendance (Database Connected) ─────────────────────────
  const [rawAttendance, setRawAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [myAttendanceStats, setMyAttendanceStats] = useState({
    totalDays: 0,
    presentDays: 0,
    lateDays: 0,
    leaveDays: 0,
    absentDays: 0,
    attendancePercentage: 100,
  });

  const fetchAttendance = useCallback(async (params = {}) => {
    const token = accessToken || localStorage.getItem("accessToken");
    const rawUser =
      user ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();
    const role = (rawUser?.role || "").toUpperCase();

    if (!token) return;

    setAttendanceLoading(true);
    try {
      if (role === "STUDENT") {
        const response = await api.get("/attendance/my-attendance");
        if (response.data.success) {
          const { stats, records } = response.data.data;
          setMyAttendanceStats(stats || {
            totalDays: 0,
            presentDays: 0,
            lateDays: 0,
            leaveDays: 0,
            absentDays: 0,
            attendancePercentage: 100,
          });
          setRawAttendance(records || []);
        }
      } else {
        const response = await api.get("/attendance", { params });
        if (response.data.success) {
          setRawAttendance(response.data.data || []);
        }
      }
      setAttendanceError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setRawAttendance([]);
        return;
      }
      console.error("Failed to fetch attendance:", err);
      setAttendanceError(err.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setAttendanceLoading(false);
    }
  }, [accessToken, user]);

  // Grouped structured attendance compatible with all existing views
  const attendance = useMemo(() => {
    const studentMap = {};

    // First populate all known students
    students.forEach((s) => {
      const sId = String(s._id || s.id);
      studentMap[sId] = {
        studentId: sId,
        id: sId,
        student: s,
        rollNo: s.rollNumber || s.rollNo || "",
        name: s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || "Student",
        attendance: [],
      };
    });

    // Populate actual database records
    rawAttendance.forEach((rec) => {
      const sId = String(rec.studentId?._id || rec.studentId || rec.student || "");
      if (!sId) return;

      if (!studentMap[sId]) {
        studentMap[sId] = {
          studentId: sId,
          id: sId,
          student: rec.studentId || null,
          rollNo: rec.studentId?.rollNumber || "",
          name: rec.studentId ? `${rec.studentId.firstName || ""} ${rec.studentId.lastName || ""}`.trim() : "Student",
          attendance: [],
        };
      }

      studentMap[sId].attendance.push({
        _id: rec._id,
        date: rec.date,
        status: rec.status,
        time: rec.checkInTime || "--:--",
        checkInTime: rec.checkInTime || "--:--",
        checkOutTime: rec.checkOutTime || "--:--",
        remarks: rec.remarks || "",
      });
    });

    return Object.values(studentMap);
  }, [students, rawAttendance]);

  const markAttendance = async (recordsToMark) => {
    setAttendanceLoading(true);
    try {
      const payload = Array.isArray(recordsToMark) ? { records: recordsToMark } : recordsToMark;
      const response = await api.post("/attendance/mark", payload);
      await fetchAttendance();
      setAttendanceError(null);
      return response.data;
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      setAttendanceError(err.response?.data?.message || "Failed to save attendance");
      throw err;
    } finally {
      setAttendanceLoading(false);
    }
  };

  const updateAttendance = async (
    studentId,
    date,
    status,
    time = "09:00 AM",
    checkOutTime = "--:--",
    remarks = ""
  ) => {
    try {
      const payload = {
        records: [
          {
            studentId,
            date: date || new Date().toISOString().split("T")[0],
            status,
            checkInTime: time,
            checkOutTime,
            remarks,
          },
        ],
      };
      await api.post("/attendance/mark", payload);
      await fetchAttendance();
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  const getStudentAttendance = (studentId) => {
    if (!studentId) return rawAttendance;
    const sId = String(studentId);
    const studentRecord = attendance.find(
      (s) => String(s.studentId) === sId || String(s.id) === sId || (s.rollNo && s.rollNo.toLowerCase() === sId.toLowerCase())
    );
    if (studentRecord && studentRecord.attendance?.length > 0) {
      return studentRecord.attendance;
    }

    // Direct fallback search across rawAttendance
    return rawAttendance
      .filter((rec) => String(rec.studentId?._id || rec.studentId) === sId)
      .map((rec) => ({
        _id: rec._id,
        date: rec.date,
        status: rec.status,
        time: rec.checkInTime || "--:--",
        checkInTime: rec.checkInTime || "--:--",
        checkOutTime: rec.checkOutTime || "--:--",
        remarks: rec.remarks || "",
      }));
  };

  const getStudentAttendanceStats = (studentId) => {
    const history = getStudentAttendance(studentId);
    const totalDays = history.length;
    const presentDays = history.filter((a) => a.status === "Present").length;
    const lateDays = history.filter((a) => a.status === "Late").length;
    const leaveDays = history.filter((a) => a.status === "Leave").length;
    const absentDays = history.filter((a) => a.status === "Absent").length;
    const percentage =
      totalDays > 0
        ? Math.round(((presentDays + lateDays) / totalDays) * 100)
        : 100;

    return {
      totalDays,
      presentDays,
      lateDays,
      leaveDays,
      absentDays,
      percentage,
    };
  };

  // ── Sync with Auth State ────────────────────────────────────
  useEffect(() => {
    if (accessToken) {
      fetchStudents();
      fetchBatches();
      fetchAttendance();
    } else {
      setStudents([]);
      setBatches([]);
      setRawAttendance([]);
    }
  }, [accessToken, fetchStudents, fetchBatches, fetchAttendance]);

  return (
    <AcademicContext.Provider
      value={{
        // Students
        students,
        studentsLoading,
        studentsError,
        setStudents,
        fetchStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        // Batches
        batches,
        setBatches,
        batchesLoading,
        batchesError,
        fetchBatches,
        addBatch,
        updateBatch,
        deleteBatch,
        // Attendance (Database Connected)
        attendance,
        rawAttendance,
        attendanceLoading,
        attendanceError,
        myAttendanceStats,
        fetchAttendance,
        markAttendance,
        updateAttendance,
        getStudentAttendance,
        getStudentAttendanceStats,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context)
    throw new Error("useAcademic must be used inside AcademicProvider");
  return context;
};

// ── Thin compatibility wrappers ───────────────────────────
export const useStudents = () => {
  const {
    students,
    studentsLoading,
    studentsError,
    setStudents,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useAcademic();
  return {
    students,
    loading: studentsLoading,
    error: studentsError,
    setStudents,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
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
  return {
    batches,
    setBatches,
    loading,
    error,
    fetchBatches,
    addBatch,
    updateBatch,
    deleteBatch,
  };
};
export const useBatch = useBatches;

export const useAttendance = () => {
  const {
    attendance,
    rawAttendance,
    attendanceLoading: loading,
    attendanceError: error,
    myAttendanceStats,
    fetchAttendance,
    markAttendance,
    updateAttendance,
    getStudentAttendance,
    getStudentAttendanceStats,
  } = useAcademic();
  return {
    attendance,
    rawAttendance,
    loading,
    error,
    myAttendanceStats,
    fetchAttendance,
    markAttendance,
    updateAttendance,
    getStudentAttendance,
    getStudentAttendanceStats,
  };
};
