import React, { useState } from "react";
import { FiCheckSquare, FiUser, FiPlus, FiStar, FiSearch } from "react-icons/fi";
import { useStudents } from "../context/AcademicContext";

function Evaluations() {
  const { students = [] } = useStudents();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState("A");
  const [feedback, setFeedback] = useState("");

  const filtered = students.filter((s) => {
    const name = `${s.firstName || ""} ${s.lastName || ""} ${s.name || ""}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Evaluations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Evaluate bootcamp participants on coding standards, sprint deliverables, and final projects
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Students List for Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((student) => (
          <div
            key={student._id || student.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {student.firstName?.[0] || student.name?.[0] || "S"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {student.firstName ? `${student.firstName} ${student.lastName || ""}` : student.name}
                  </h3>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Roll: {student.rollNo || "N/A"}</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(student)}
              className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
            >
              <FiCheckSquare size={14} /> Evaluate Performance
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            <FiUser size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No students found.</p>
          </div>
        )}
      </div>

      {/* Modal / Evaluation Sheet */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                Evaluate {selectedStudent.firstName || selectedStudent.name}
              </h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Grade Score</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="A+">A+ (Exceptional - 90-100%)</option>
                  <option value="A">A (Good - 80-89%)</option>
                  <option value="B">B (Satisfactory - 70-79%)</option>
                  <option value="C">C (Needs Improvement - 60-69%)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Mentor Assessment & Feedback</label>
                <textarea
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter detailed evaluation feedback for the student..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Evaluation saved successfully!");
                  setSelectedStudent(null);
                  setFeedback("");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Evaluations;
