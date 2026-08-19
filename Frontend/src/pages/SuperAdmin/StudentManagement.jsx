import React, { useState } from "react";
import { FiUsers, FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { useStudent } from "../../context/AcademicContext";
import AddStudentModal from "../../components/features/Students/AddStudentModal";

function StudentManagement() {
  const { students, fetchStudents, addStudent, updateStudent, deleteStudent } =
    useStudent();

  React.useEffect(() => {
    if (fetchStudents) fetchStudents();
  }, [fetchStudents]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const getStudentName = (s) =>
    s.name ||
    `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
    s.email ||
    "Student";

  const getStudentInitials = (s) => {
    if (s.initials) return s.initials;
    const n = getStudentName(s);
    return (
      n
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "ST"
    );
  };

  const filtered = students.filter((s) => {
    const name = getStudentName(s).toLowerCase();
    const roll = (s.rollNumber || s.rollNo || "").toLowerCase();
    const email = (s.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || roll.includes(q) || email.includes(q);
  });

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

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiUsers className="text-emerald-600" />
              SuperAdmin Student Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Full system authority to enroll, modify, or remove student
              accounts
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow-xs transition cursor-pointer"
          >
            <FiPlus size={16} />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <FiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-6 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span>Roll No</span>
          <span className="col-span-2">Name & Email</span>
          <span>Gender</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => {
            const studentName = getStudentName(item);
            const studentInitials = getStudentInitials(item);
            const isStatusActive =
              (item.status || "").toLowerCase() === "active";

            return (
              <div
                key={item._id || item.id}
                className="grid grid-cols-6 px-5 py-4 items-center hover:bg-gray-50 text-sm"
              >
                <span className="font-semibold text-gray-700 text-xs">
                  {item.rollNumber || item.rollNo || "N/A"}
                </span>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    {studentInitials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{studentName}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 capitalize">
                  {item.gender || "Unspecified"}
                </span>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      isStatusActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status || "active"}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3 text-gray-400">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="hover:text-emerald-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove this student?",
                        )
                      ) {
                        deleteStudent(item._id || item.id);
                      }
                    }}
                    className="hover:text-red-600 transition cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No students found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddStudentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStudent(null);
        }}
        editingStudent={editingStudent}
        onAddStudent={handleSaveStudent}
      />
    </div>
  );
}

export default StudentManagement;
