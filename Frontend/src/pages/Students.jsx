import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEdit2,
  FiEye,
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
} from "react-icons/fi";

import { useStudent } from "../context/AcademicContext";
import AddStudentModal from "../components/features/Students/AddStudentModal";

function Students() {
  const { students, fetchStudents, addStudent } = useStudent();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  React.useEffect(() => {
    if (fetchStudents) fetchStudents();
  }, [fetchStudents]);

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

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();
    const name = getStudentName(student).toLowerCase();
    const roll = (student.rollNumber || student.rollNo || "").toLowerCase();
    const team = (student.team || "").toLowerCase();
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
    (student) => (student.status || "").toLowerCase() === "active"
  ).length;

  const atRiskStudents = students.filter(
    (student) => (student.status || "").toLowerCase() === "at risk" || (student.attendance && student.attendance < 75)
  ).length;

  const handleAddStudent = (newStudent) => {
    addStudent(newStudent);
  };

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="mb-5"></div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {totalStudents}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Total Students
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUsers size={23} className="text-blue-600" />
          </div>
        </div>

        {/* Active */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeStudents}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Active
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle size={23} className="text-green-600" />
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {atRiskStudents}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              At Risk
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle size={23} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Student Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          {/* Search */}
          <div className="relative w-80">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll no..."
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Add Student Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition"
          >
            <FiPlus size={17} />
            Add Student
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.8fr_1.6fr_1.5fr_1.2fr_1fr] items-center px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
          <span>Roll No</span>
          <span>Name</span>
          <span>Team</span>
          <span>Attendance</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Table Rows */}
        {filteredStudents.map((student) => {
          const studentName = getStudentName(student);
          const studentInitials = getStudentInitials(student);
          const attVal = student.attendance !== undefined ? student.attendance : 90;
          const isActive = (student.status || "").toLowerCase() === "active";

          return (
            <div
              key={student._id || student.id}
              className="grid grid-cols-[1fr_1.8fr_1.6fr_1.5fr_1.2fr_1fr] items-center px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition"
            >
              {/* Roll No */}
              <span className="text-xs text-gray-600">
                {student.rollNumber || student.rollNo || "N/A"}
              </span>

              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[11px] font-semibold">
                  {studentInitials}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {studentName}
                </span>
              </div>

              {/* Team */}
              <span className="text-xs text-gray-500">
                {student.team || "Unassigned"}
              </span>

              {/* Attendance */}
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      attVal < 70 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${attVal}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-700">
                  {attVal}%
                </span>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {student.status || "Active"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* View */}
                <Link
                  to={`/students/${student._id || student.id}`}
                  title="View Student Details"
                  className="text-gray-400 hover:text-blue-600 transition"
                >
                  <FiEye size={17} />
                </Link>
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No students found.
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddStudent={handleAddStudent}
      />
    </div>
  );
}

export default Students;