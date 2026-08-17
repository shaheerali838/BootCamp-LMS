import React, { useState } from "react";
import { FiUsers, FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { useStudent, useBatches } from "../../context/AcademicContext";
import { useAdmins } from "../../context/SystemContext";

function StudentManagement() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudent();
  const { batches = [] } = useBatches();
  const { admins = [] } = useAdmins();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    email: "",
    phoneNumber: "",
    password: "Student@123",
    gender: "male",
    dateOfBirth: "2002-01-01",
    batchId: "",
    mentorId: "",
    status: "active",
  });

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

  const filtered = students.filter((s) => {
    const name = getStudentName(s).toLowerCase();
    const roll = (s.rollNumber || s.rollNo || "").toLowerCase();
    const email = (s.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || roll.includes(q) || email.includes(q);
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      firstName: "",
      lastName: "",
      rollNumber: `SMIT-${Math.floor(1000 + Math.random() * 9000)}`,
      email: "",
      phoneNumber: "",
      password: "Student@123",
      gender: "male",
      dateOfBirth: "2002-01-01",
      batchId: batches[0] ? (batches[0]._id || batches[0].id) : "",
      mentorId: admins[0] ? (admins[0]._id || admins[0].id) : "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    const nameParts = (student.name || "").split(" ");
    setFormData({
      firstName: student.firstName || nameParts[0] || "",
      lastName: student.lastName || nameParts.slice(1).join(" ") || "",
      rollNumber: student.rollNumber || student.rollNo || "",
      email: student.email || "",
      phoneNumber: student.phoneNumber || student.phone || "",
      password: "",
      gender: student.gender || "male",
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "2002-01-01",
      batchId: student.batchId || (batches[0] ? (batches[0]._id || batches[0].id) : ""),
      mentorId: student.mentorId || (admins[0] ? (admins[0]._id || admins[0].id) : ""),
      status: student.status || "active",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const initials = getStudentInitials({ name: fullName });

    const payload = {
      ...formData,
      name: fullName,
      rollNo: formData.rollNumber,
      phone: formData.phoneNumber,
      initials,
    };

    if (editingStudent) {
      updateStudent(editingStudent._id || editingStudent.id, payload);
    } else {
      addStudent(payload);
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
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
            const isStatusActive = (item.status || "").toLowerCase() === "active";

            return (
              <div key={item._id || item.id} className="grid grid-cols-6 px-5 py-4 items-center hover:bg-gray-50 text-sm">
                <span className="font-semibold text-gray-700 text-xs">{item.rollNumber || item.rollNo || "N/A"}</span>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    {studentInitials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{studentName}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 capitalize">{item.gender || "Unspecified"}</span>
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
                      if (window.confirm("Are you sure you want to remove this student?")) {
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editingStudent ? "Edit Student Account" : "Enroll New Student"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Ayesha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Siddiqui"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@smit.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="03000000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Enrolled Batch *
                  </label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Batch</option>
                    {batches.map((b) => (
                      <option key={b._id || b.id} value={b._id || b.id}>
                        {b.batchName || b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Assigned Mentor *
                  </label>
                  <select
                    value={formData.mentorId}
                    onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Mentor</option>
                    {admins.map((a) => (
                      <option key={a._id || a.id} value={a._id || a.id}>
                        {a.firstName ? `${a.firstName} ${a.lastName || ""}` : a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
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
