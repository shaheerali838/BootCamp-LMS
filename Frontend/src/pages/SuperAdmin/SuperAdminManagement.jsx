import React, { useEffect, useState } from "react";
import { FiShield, FiPlus, FiTrash2, FiEdit2, FiSearch, FiEye, FiEyeOff } from "react-icons/fi";
import { useAdmins } from "../../context/SystemContext";
import { PageSkeleton } from "../../components/common/Skeleton";

function SuperAdminManagement() {
  const {
    admins = [],
    loading: adminsLoading,
    fetchAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
  } = useAdmins();
  const [search, setSearch] = useState("");
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
    password: "SuperAdmin@123",
    role: "SUPER_ADMIN",
    status: "active",
  });

  const getAdminName = (a) =>
    a.name ||
    `${a.firstName || ""} ${a.lastName || ""}`.trim() ||
    a.email ||
    "Super Admin";

  const superAdmins = admins.filter((a) => {
    const r = (a.role || "").toUpperCase().replace(/[\s_]+/g, "");
    return r === "SUPERADMIN";
  });

  const filtered = superAdmins.filter((a) => {
    const name = getAdminName(a).toLowerCase();
    const email = (a.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const [modalError, setModalError] = useState("");

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setModalError("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "SuperAdmin@123",
      role: "SUPER_ADMIN",
      status: "active",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setModalError("");
    const nameParts = (admin.name || "").split(" ");
    setFormData({
      firstName: admin.firstName || nameParts[0] || "",
      lastName: admin.lastName || nameParts.slice(1).join(" ") || "",
      email: admin.email || "",
      phoneNumber: admin.phoneNumber || admin.phone || "",
      password: "",
      role: "SUPER_ADMIN",
      status: admin.status || "active",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.firstName.trim()) {
      setModalError("First Name is required.");
      return;
    }
    if (!formData.lastName.trim()) {
      setModalError("Last Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setModalError("Email is required.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setModalError("Phone Number is required.");
      return;
    }
    if (!editingAdmin && (!formData.password || formData.password.length < 6)) {
      setModalError("Password must be at least 6 characters.");
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const payload = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      name: fullName,
      phone: formData.phoneNumber.trim(),
    };

    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin._id || editingAdmin.id, payload);
      } else {
        await addAdmin(payload);
      }
      setShowModal(false);
    } catch (err) {
      setModalError(err?.response?.data?.message || err?.message || "Failed to save super admin.");
    }
  };

  if (adminsLoading && admins.length === 0) {
    return <PageSkeleton hasStats={false} rowCount={6} />;
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiShield className="text-purple-700" />
              SuperAdmin Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Highest level authority: Manage system-level Super Administrator
              accounts
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-xs shadow-xs transition cursor-pointer shrink-0"
          >
            <FiPlus size={16} />
            Add Super Admin
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
            placeholder="Search super admins by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs w-full max-w-full min-w-0">
        <div className="overflow-x-auto w-full min-w-0 max-w-full">
          <div className="grid grid-cols-5 min-w-[550px] px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Name & Contact</span>
          <span>Role & Authority</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => {
            const adminName = getAdminName(item);
            const isStatusActive =
              (item.status || "").toLowerCase() === "active";

            return (
              <div
                key={item._id || item.id}
                className="grid grid-cols-5 min-w-[550px] px-5 py-4 items-center hover:bg-gray-50 text-sm"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-purple-200 shadow-2xs">
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
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                    SUPER ADMIN
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
                    className="hover:text-purple-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove this super admin?",
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
              No Super Admins found.
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingAdmin ? "Edit Super Admin" : "Add Super Admin"}
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
                    placeholder="e.g. Super"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-purple-500"
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
                    placeholder="e.g. Admin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-purple-500"
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
                  placeholder="superadmin@smit.edu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-purple-500"
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
                      placeholder="e.g. SuperAdmin@123"
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-purple-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Super Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminManagement;
