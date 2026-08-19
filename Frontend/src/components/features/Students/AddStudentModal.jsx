import React, { useState, useEffect, useMemo } from "react";
import { FiX, FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useBatches } from "../../../context/AcademicContext";
import { useAdmins } from "../../../context/SystemContext";

function AddStudentModal({
  isOpen,
  onClose,
  onAdd,
  onAddStudent,
  editingStudent = null,
}) {
  const { batches = [] } = useBatches();
  const { mentors = [], admins = [], fetchMentors } = useAdmins();

  const availableMentors = useMemo(() => {
    return (mentors.length > 0 ? mentors : admins).filter((m) => {
      const r = (m.role || "").toUpperCase().replace(/[\s_]+/g, "");
      return r !== "SUPERADMIN";
    });
  }, [mentors, admins]);

  const [showPassword, setShowPassword] = useState(false);
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

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && fetchMentors) {
      fetchMentors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setShowPassword(false);

    if (editingStudent) {
      const nameParts = (editingStudent.name || "").split(" ");
      setFormData({
        firstName:
          editingStudent.firstName || nameParts[0] || "",
        lastName:
          editingStudent.lastName ||
          nameParts.slice(1).join(" ") ||
          "",
        email: editingStudent.email || "",
        password: "",
        phoneNumber:
          editingStudent.phoneNumber || editingStudent.phone || "",
        rollNumber:
          editingStudent.rollNumber || editingStudent.rollNo || "",
        gender: (editingStudent.gender || "male").toLowerCase(),
        dateOfBirth: editingStudent.dateOfBirth
          ? new Date(editingStudent.dateOfBirth).toISOString().split("T")[0]
          : "2002-01-01",
        batchId:
          editingStudent.batchId?._id ||
          (typeof editingStudent.batchId === "string" ? editingStudent.batchId : "") ||
          editingStudent.batch?._id ||
          (typeof editingStudent.batch === "string" ? editingStudent.batch : "") ||
          (batches[0] ? batches[0]._id || batches[0].id : ""),
        mentorId:
          editingStudent.mentorId?._id ||
          (typeof editingStudent.mentorId === "string" ? editingStudent.mentorId : "") ||
          editingStudent.mentor?._id ||
          (typeof editingStudent.mentor === "string" ? editingStudent.mentor : "") ||
          (availableMentors[0]
            ? availableMentors[0]._id || availableMentors[0].id
            : ""),
        status: editingStudent.status || "active",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "Student@123",
        phoneNumber: "",
        rollNumber: `SMIT-${Math.floor(1000 + Math.random() * 9000)}`,
        gender: "male",
        dateOfBirth: "2002-01-01",
        batchId: batches[0] ? batches[0]._id || batches[0].id : "",
        mentorId: availableMentors[0]
          ? availableMentors[0]._id || availableMentors[0].id
          : "",
        status: "active",
      });
    }
  }, [isOpen, editingStudent]);

  // Sync batchId and mentorId once batches/mentors finish loading if not yet set
  useEffect(() => {
    if (isOpen && !editingStudent) {
      setFormData((prev) => {
        let updated = false;
        const next = { ...prev };
        if (!next.batchId && batches.length > 0) {
          next.batchId = batches[0]._id || batches[0].id || "";
          updated = true;
        }
        if (!next.mentorId && availableMentors.length > 0) {
          next.mentorId = availableMentors[0]._id || availableMentors[0].id || "";
          updated = true;
        }
        return updated ? next : prev;
      });
    }
  }, [isOpen, editingStudent, batches, availableMentors]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName.trim()) {
      setError("First Name is required.");
      return;
    }
    if (!formData.lastName.trim()) {
      setError("Last Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (!formData.rollNumber.trim()) {
      setError("Roll number is required.");
      return;
    }
    if (!editingStudent && (!formData.password || formData.password.length < 6)) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (editingStudent && formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!formData.dateOfBirth) {
      setError("Date of Birth is required.");
      return;
    }
    if (!formData.batchId) {
      setError(
        "Please select a Batch. If no batches exist, create one in Batch Management first.",
      );
      return;
    }
    if (!formData.mentorId) {
      setError(
        "Please select an Assigned Mentor. If no mentors exist, add one in Admin Management first.",
      );
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

    const payload = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      rollNumber: formData.rollNumber.trim(),
      name: fullName,
      rollNo: formData.rollNumber.trim(),
      phone: formData.phoneNumber.trim(),
      initials,
    };

    if (editingStudent && !formData.password) {
      delete payload.password;
    }

    const addFn = onAdd || onAddStudent;
    if (addFn) {
      try {
        setSubmitting(true);
        await addFn(payload);
        onClose();
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to save student. Please check input values.",
        );
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {editingStudent ? "Edit Student Account" : "Enroll New Student"}
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
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-6 space-y-4 text-xs"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
              <FiAlertCircle size={16} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

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
                Password {editingStudent ? "(Leave blank to keep unchanged)" : "*"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingStudent}
                  minLength={6}
                  placeholder={editingStudent ? "Leave blank to keep current password" : "e.g. Student@123"}
                  className="w-full pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
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
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b._id || b.id} value={b._id || b.id}>
                    {b.batchName || b.name} ({b.program || "Tech"})
                  </option>
                ))}
              </select>
              {batches.length === 0 && (
                <p className="text-amber-600 text-[11px] mt-1">
                  ⚠️ No batches found. Create a batch first.
                </p>
              )}
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
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="">Select Mentor</option>
                {availableMentors.map((a) => (
                  <option key={a._id || a.id} value={a._id || a.id}>
                    {a.firstName
                      ? `${a.firstName} ${a.lastName || ""}`
                      : a.name}
                  </option>
                ))}
              </select>
              {availableMentors.length === 0 && (
                <p className="text-amber-600 text-[11px] mt-1">
                  ⚠️ No mentors found. Add an admin/mentor first.
                </p>
              )}
            </div>

            {/* Account Status */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Account Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? editingStudent
                  ? "Updating..."
                  : "Enrolling..."
                : editingStudent
                ? "Update Student"
                : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
