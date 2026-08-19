import React, { useEffect, useState } from "react";
import {
  FiUserCheck,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiLoader,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAdmins } from "../../context/SystemContext";

function AdminManagement() {
  const {
    admins = [],
    fetchAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  } = useAdmins();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (fetchAdmins) fetchAdmins();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "Admin@123",
    role: "ADMIN",
    status: "active",
  });

  const getAdminName = (a) =>
    a.name ||
    `${a.firstName || ""} ${a.lastName || ""}`.trim() ||
    a.email ||
    "Admin";

  const getAdminRole = (a) => {
    const r = (a.role || "").toUpperCase().replace(/[\s_]+/g, "");
    if (r === "SUPERADMIN") return "Super Admin";
    if (r === "MENTOR") return "Mentor";
    return "Admin";
  };

  const adminsMentors = admins.filter((a) => {
    const r = (a.role || "").toUpperCase().replace(/[\s_]+/g, "");
    return r !== "SUPERADMIN";
  });

  const filtered = adminsMentors.filter((a) => {
    const name = getAdminName(a).toLowerCase();
    const email = (a.email || "").toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = name.includes(q) || email.includes(q);

    const actualRole = getAdminRole(a);
    const matchRole =
      roleFilter === "All" ||
      actualRole.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "Admin@123",
      role: "ADMIN",
      status: "active",
    });
    setModalError("");
    setShowModal(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      email: admin.email || "",
      phoneNumber: admin.phoneNumber || admin.phone || "",
      password: "",
      role: (admin.role || "ADMIN").toUpperCase().replace(/[\s_]+/g, "") === "MENTOR" ? "MENTOR" : "ADMIN",
      status: admin.status || "active",
    });
    setModalError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.firstName.trim() || !formData.email.trim()) {
      setModalError("First Name and Email are required.");
      return;
    }

    if (!editingAdmin && (!formData.password || formData.password.length < 6)) {
      setModalError("Password must be at least 6 characters.");
      return;
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const payload = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      name: fullName,
      phone: formData.phoneNumber.trim(),
    };

    setSubmitting(true);
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin._id || editingAdmin.id, payload);
      } else {
        await addAdmin(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(err?.response?.data?.message || err?.message || "Failed to save administrator.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiUserCheck className="text-blue-600" />
              Admin & Mentor Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage system administrators and academic mentors
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow-xs transition cursor-pointer"
          >
            <FiPlus size={16} />
            Add Administrator
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <FiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["All", "Admin", "Mentor"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === role
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Name & Contact</span>
          <span>Role</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => {
            const adminName = getAdminName(item);
            const role = getAdminRole(item);
            const isStatusActive =
              (item.status || "").toLowerCase() === "active";

            return (
              <div
                key={item._id || item.id}
                className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-blue-200 shadow-2xs">
                    {item.profilePicture || item.profileImage || item.image ? (
                      <img src={item.profilePicture || item.profileImage || item.image} alt={adminName} className="w-full h-full object-cover" />
                    ) : (
                      adminName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{adminName}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                  </div>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {role}
                  </span>
                </div>
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
                    className="hover:text-blue-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove this user?",
                        )
                      ) {
                        deleteAdmin(item._id || item.id);
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
              No administrators found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingAdmin ? "Edit Administrator" : "Add New Administrator"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {modalError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="e.g. Ali"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
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
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="e.g. Khan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="admin@smit.edu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="e.g. Admin@123"
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
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
              )}

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="03000000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MENTOR">Mentor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
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
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FiLoader size={14} className="animate-spin" />
                      <span>{editingAdmin ? "Updating Administrator..." : "Saving Administrator..."}</span>
                    </>
                  ) : (
                    <span>{editingAdmin ? "Save Changes" : "Save Administrator"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
