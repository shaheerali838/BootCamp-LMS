import React, { useState } from "react";
import { FiUsers, FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { useStudent } from "../../context/AcademicContext";

function StudentManagement() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudent();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    phone: "",
    team: "Unassigned",
    status: "Active",
  });

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      (s.team || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      rollNo: `SMIT-${Math.floor(1000 + Math.random() * 9000)}`,
      email: "",
      phone: "",
      team: "Unassigned",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      phone: student.phone || "",
      team: student.team || "Unassigned",
      status: student.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    if (editingStudent) {
      updateStudent(editingStudent.id, { ...formData, initials });
    } else {
      addStudent({ ...formData, initials, attendance: 100 });
    }
    setShowModal(false);
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
              Full system authority to enroll, modify, or remove student accounts
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, or team..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-6 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span>Roll No</span>
          <span className="col-span-2">Name & Email</span>
          <span>Team</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-6 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <span className="font-semibold text-gray-700 text-xs">{item.rollNo}</span>
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  {item.initials}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.email}</div>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.team || "Unassigned"}</span>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-emerald-600 transition"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => deleteStudent(item.id)}
                  className="hover:text-red-600 transition"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No students found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingStudent ? "Edit Student" : "Enroll New Student"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ayesha Siddiqui"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@smit.edu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;
