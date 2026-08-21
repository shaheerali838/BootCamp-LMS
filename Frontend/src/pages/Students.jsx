import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
} from "react-icons/fi";

import { useStudent } from "../context/AcademicContext";
import { useTeamProject } from "../context/TeamProjectContext";
import AddStudentModal from "../components/features/Students/AddStudentModal";
import { PageSkeleton } from "../components/common/Skeleton";

function Students() {
  const {
    students,
    loading: studentsLoading,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useStudent();
  const { teams = [], fetchTeams } = useTeamProject();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    if (fetchStudents) fetchStudents();
    if (fetchTeams) fetchTeams();
  }, [fetchStudents, fetchTeams]);

  const getStudentName = (s) =>
    s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.email || "Student";

  const getStudentInitials = (s) => {
    if (s.initials) return s.initials;
    const n = getStudentName(s);
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";
  };

  const getStudentTeam = (student) => {
    const sid = String(student._id || student.id || "");
    const studentRoll = String(student.rollNumber || student.rollNo || "").toLowerCase();
    const studentName = String(
      student.firstName ? `${student.firstName} ${student.lastName || ""}` : student.name || ""
    ).trim().toLowerCase();

    const found = teams.find((team) => {
      const leadId = String(team.teamLead?._id || team.teamLead || team.lead || "");
      const leadName = String(
        team.teamLead?.name || team.teamLead?.firstName
          ? `${team.teamLead.firstName} ${team.teamLead.lastName || ""}`
          : team.lead || ""
      ).toLowerCase();

      if (leadId && leadId === sid) return true;
      if (leadName && studentName && leadName === studentName) return true;

      if (Array.isArray(team.members)) {
        return team.members.some((m) => {
          const mId = String(m._id || m.id || m.studentId || m);
          const mRoll = String(m.rollNumber || m.rollNo || "").toLowerCase();
          const mName = String(
            m.name || m.firstName ? `${m.firstName} ${m.lastName || ""}` : m
          ).toLowerCase();
          return (
            (sid && mId === sid) ||
            (studentRoll && mRoll === studentRoll) ||
            (studentName && mName === studentName)
          );
        });
      }
      return false;
    });

    return found ? (found.teamName || found.name) : "Unassigned";
  };

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();
    const name = getStudentName(student).toLowerCase();
    const roll = (student.rollNumber || student.rollNo || "").toLowerCase();
    const team = getStudentTeam(student).toLowerCase();
    const email = (student.email || "").toLowerCase();

    return (
      name.includes(value) ||
      roll.includes(value) ||
      team.includes(value) ||
      email.includes(value)
    );
  });

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (s) => (s.status || "").toLowerCase() === "active"
  ).length;
  const inactiveStudents = totalStudents - activeStudents;

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleSaveStudent = async (payload) => {
    if (editingStudent) {
      await updateStudent(editingStudent._id || editingStudent.id, payload);
    } else {
      await addStudent(payload);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      await deleteStudent(studentId);
    }
  };

  if (studentsLoading && students.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {totalStudents}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Registered in Bootcamp
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiUsers size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Status
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {activeStudents}
            </h3>
            <p className="text-xs text-green-600 mt-1">
              Currently attending
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <FiCheckCircle size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Inactive / On Leave
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {inactiveStudents}
            </h3>
            <p className="text-xs text-amber-600 mt-1">
              Requires attention
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiAlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {/* Search & Add Button Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-4 border-b border-gray-200">
          <div className="relative w-full sm:w-80">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, roll no, or team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <FiPlus size={16} />
            Add Student
          </button>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[750px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1.8fr_1.4fr_1.4fr_1.1fr_1.2fr] items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
              <span>Roll No</span>
              <span>Name</span>
              <span>Team</span>
              <span>Attendance</span>
              <span>Status</span>
              <span className="text-right pr-2">Actions</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const studentName = getStudentName(student);
                const studentInitials = getStudentInitials(student);
                const studentTeam = getStudentTeam(student);
                const attVal = student.attendance !== undefined ? student.attendance : 90;
                const isActive = (student.status || "").toLowerCase() === "active";

                return (
                  <div
                    key={student._id || student.id}
                    className="grid grid-cols-[1fr_1.8fr_1.4fr_1.4fr_1.1fr_1.2fr] items-center px-4 py-3 hover:bg-gray-50 transition text-xs"
                  >
                    {/* Roll No */}
                    <span className="font-semibold text-gray-700">
                      {student.rollNumber || student.rollNo || "N/A"}
                    </span>

                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0 border border-gray-100 shadow-2xs">
                        {student.profilePicture || student.profileImage ? (
                          <img
                            src={student.profilePicture || student.profileImage}
                            alt={studentName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          studentInitials
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {studentName}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {student.email || "No email"}
                        </div>
                      </div>
                    </div>

                    {/* Team */}
                    <span className={`font-medium truncate ${
                      studentTeam !== "Unassigned" ? "text-blue-600 font-semibold" : "text-gray-400"
                    }`}>
                      {studentTeam}
                    </span>

                    {/* Attendance */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 lg:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            attVal < 70 ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{
                            width: `${attVal}%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-700 font-semibold">
                        {attVal}%
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {student.status || "Active"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5 text-gray-400 pr-1">
                      <Link
                        to={`/students/${student._id || student.id}`}
                        className="p-1.5 hover:bg-blue-50 rounded-lg hover:text-blue-600 transition"
                        title="View Details"
                      >
                        <FiEye size={15} />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="p-1.5 hover:bg-emerald-50 rounded-lg hover:text-emerald-600 transition cursor-pointer"
                        title="Edit Student"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id || student.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg hover:text-red-600 transition cursor-pointer"
                        title="Delete Student"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-500">
                  No students found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && (
        <AddStudentModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingStudent(null);
          }}
          editingStudent={editingStudent}
          onAddStudent={handleSaveStudent}
        />
      )}
    </div>
  );
}

export default Students;