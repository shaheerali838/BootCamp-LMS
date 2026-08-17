import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { useBatches } from "../../../context/AcademicContext";
import { useAdmins } from "../../../context/SystemContext";

function AddStudentModal({ isOpen, onClose, onAdd, onAddStudent }) {
  const { batches = [] } = useBatches();
  const { admins = [] } = useAdmins();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "Student@123",
    phoneNumber: "",
    rollNumber: `SMIT-${Math.floor(1000 + Math.random() * 9000)}`,
    gender: "male",
    dateOfBirth: "2002-01-01",
    batchId: "",
    mentorId: "",
    status: "active",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedBatchId = formData.batchId || (batches[0] ? (batches[0]._id || batches[0].id) : undefined);
    const selectedMentorId = formData.mentorId || (admins[0] ? (admins[0]._id || admins[0].id) : undefined);

    const payload = {
      ...formData,
      batchId: selectedBatchId,
      mentorId: selectedMentorId,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      rollNo: formData.rollNumber,
      phone: formData.phoneNumber,
    };

    const addFn = onAdd || onAddStudent;
    if (addFn) {
      addFn(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Enroll New Student
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Ayesha"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Siddiqui"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="e.g. SMIT-1001"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@smit.edu"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="03000000000"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Batch */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Enrolled Batch *
              </label>
              <select
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b._id || b.id} value={b._id || b.id}>
                    {b.batchName || b.name} ({b.program || "Tech"})
                  </option>
                ))}
              </select>
            </div>

            {/* Mentor */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Assigned Mentor *
              </label>
              <select
                name="mentorId"
                value={formData.mentorId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select Mentor</option>
                {admins.map((a) => (
                  <option key={a._id || a.id} value={a._id || a.id}>
                    {a.firstName ? `${a.firstName} ${a.lastName || ""}` : a.name} ({a.role || "Mentor"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition cursor-pointer"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;