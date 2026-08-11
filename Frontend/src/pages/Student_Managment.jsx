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

import { studentData } from "../components/common/studentData";
import AddStudentModal from "../components/Student_Managment/AddStudentModal";

function Students() {
  const [students, setStudents] = useState(studentData);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(value) ||
      student.rollNo.toLowerCase().includes(value) ||
      student.team.toLowerCase().includes(value)
    );
  });

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const atRiskStudents = students.filter(
    (student) => student.status === "At Risk"
  ).length;

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  return (
    <div className="p-5">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-lg">Home</span>

            <span className="text-gray-300">›</span>

            <h1 className="text-xl font-semibold text-gray-800">
              Students
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition"
        >
          <FiPlus size={20} />

          Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        {/* Total */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-semibold text-gray-900">
              {totalStudents}
            </h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mt-2">
              Total Students
            </p>
          </div>

          <div className="w-18 h-18 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUsers
              size={32}
              className="text-blue-600"
            />
          </div>
        </div>

        {/* Active */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-semibold text-gray-900">
              {activeStudents}
            </h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mt-2">
              Active
            </p>
          </div>

          <div className="w-18 h-18 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheckCircle
              size={32}
              className="text-green-600"
            />
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-semibold text-gray-900">
              {atRiskStudents}
            </h2>

            <p className="text-sm text-gray-500 uppercase tracking-wide mt-2">
              At Risk
            </p>
          </div>

          <div className="w-18 h-18 rounded-full bg-red-100 flex items-center justify-center">
            <FiAlertTriangle
              size={32}
              className="text-red-500"
            />
          </div>
        </div>
      </div>

      {/* Student Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-200">
          <div className="relative w-90">
            <FiSearch
              size={21}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or roll no..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition"
          >
            <FiPlus size={19} />

            Add Student
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.8fr_1.6fr_1.5fr_1.2fr_1fr] items-center px-7 py-5 bg-gray-50 text-sm font-medium text-gray-500 uppercase">
          <span>Roll No</span>

          <span>Name</span>

          <span>Team</span>

          <span>Attendance</span>

          <span>Status</span>

          <span>Actions</span>
        </div>

        {/* Table Rows */}
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="grid grid-cols-[1fr_1.8fr_1.6fr_1.5fr_1.2fr_1fr] items-center px-7 py-5 border-t border-gray-100 hover:bg-gray-50 transition"
          >
            {/* Roll No */}
            <span className="text-sm text-gray-600">
              {student.rollNo}
            </span>

            {/* Name */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                {student.initials}
              </div>

              <span className="text-base font-medium text-gray-900">
                {student.name}
              </span>
            </div>

            {/* Team */}
            <span className="text-sm text-gray-500">
              {student.team}
            </span>

            {/* Attendance */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    student.attendance < 70
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${student.attendance}%`,
                  }}
                />
              </div>

              <span className="text-sm text-gray-700">
                {student.attendance}%
              </span>
            </div>

            {/* Status */}
            <div>
              <span
                className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium ${
                  student.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {student.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5">
              <button
                title="Edit Student"
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <FiEdit2 size={20} />
              </button>

              <Link
                to={`/students/${student.id}`}
                title="View Student"
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <FiEye size={21} />
              </Link>
            </div>
          </div>
        ))}

        {/* No Students */}
        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">
              No students found.
            </p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddStudent}
        />
      )}
    </div>
  );
}

export default Students;