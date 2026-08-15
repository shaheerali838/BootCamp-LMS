import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

import { useStudent } from "../../../context/StudentContext";

function StudentDetails() {
  const { id } = useParams();
  const { students } = useStudent();

  const student = students.find(
    (item) => item.id === Number(id)
  );

  if (!student) {
    return (
      <div className="p-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Student not found
        </h1>

        <Link
          to="/students"
          className="inline-flex items-center gap-2 mt-4 text-blue-600"
        >
          <FiArrowLeft />

          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link
          to="/students"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <FiArrowLeft size={21} />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              Home
            </span>

            <span className="text-gray-300">
              ›
            </span>

            <Link
              to="/students"
              className="text-gray-400 hover:text-blue-600"
            >
              Students
            </Link>

            <span className="text-gray-300">
              ›
            </span>

            <span className="font-semibold text-gray-800">
              {student.name}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-7">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-semibold">
            {student.initials}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {student.name}
              </h1>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {student.status}
              </span>
            </div>

            <p className="text-gray-500 mt-1">
              {student.rollNo}
            </p>

            <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiMail />

                {student.email}
              </div>

              <div className="flex items-center gap-2">
                <FiPhone />

                {student.phone}
              </div>

              <div className="flex items-center gap-2">
                <FiUsers />

                {student.team}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Attendance
          </p>

          <h2 className="text-3xl font-semibold text-gray-900 mt-2">
            {student.attendance}%
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Team
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-3">
            {student.team}
          </h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Roll Number
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-3">
            {student.rollNo}
          </h2>
        </div>
      </div>

      {/* Future Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Progress
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Student progress will be displayed here.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Attendance History
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Attendance history will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;