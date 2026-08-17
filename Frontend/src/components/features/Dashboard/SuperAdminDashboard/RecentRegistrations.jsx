import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAdmins } from "../../../../context/SystemContext";
import { useStudents } from "../../../../context/AcademicContext";

function RecentRegistrations() {
  const { admins = [] } = useAdmins();
  const { students = [] } = useStudents();
  const [page, setPage] = useState(1);

  const getAdminName = (a) =>
    a.name || `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.email || "Admin";

  const getStudentName = (s) =>
    s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.email || "Student";

  const allRegistrations = [
    ...admins.map((a) => {
      const r = (a.role || "").toUpperCase();
      const roleLabel =
        r === "SUPER_ADMIN" || r === "SUPERADMIN"
          ? "Super Admin"
          : r === "MENTOR"
          ? "Mentor"
          : "Admin";
      return {
        id: a._id || a.id,
        name: getAdminName(a),
        email: a.email,
        role: roleLabel,
        date: a.createdAt
          ? new Date(a.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "Recently",
      };
    }),
    ...students.map((s) => ({
      id: s._id || s.id,
      name: getStudentName(s),
      email: s.email,
      role: "Student",
      date: s.createdAt
        ? new Date(s.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Recently",
    })),
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(allRegistrations.length / itemsPerPage) || 1;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayed = allRegistrations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "Admin":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "Mentor":
        return "bg-amber-100 text-amber-700 border-amber-200";

      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm h-[380px] overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Recent Registrations
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Newly registered accounts across all roles
            </p>
          </div>

          <Link
            to="/superadmin/students"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All
          </Link>
        </div>

        {/* Registration List */}
        <div className="divide-y divide-gray-100 mt-1 flex-1 min-h-0 overflow-hidden">
          {displayed.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between hover:bg-gray-50/50 px-1 rounded-lg transition"
            >
              {/* User */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {item.name
                    ? item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 leading-tight truncate">
                    {item.name}
                  </h3>

                  <p className="text-[10px] text-gray-400 font-medium truncate">
                    {item.email}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="text-right shrink-0 ml-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadgeStyle(
                    item.role
                  )}`}
                >
                  {item.role}
                </span>

                <p className="text-[10px] text-gray-400 mt-0.5">
                  {item.date}
                </p>
              </div>
            </div>
          ))}

          {displayed.length === 0 && (
            <div className="py-6 text-center text-xs text-gray-500">
              No registered accounts found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 mt-auto">
        <span>
          Showing {allRegistrations.length > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + itemsPerPage, allRegistrations.length)} of{" "}
          {allRegistrations.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
          >
            <FiChevronLeft size={14} />
          </button>

          <span className="px-2 font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition cursor-pointer"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecentRegistrations;