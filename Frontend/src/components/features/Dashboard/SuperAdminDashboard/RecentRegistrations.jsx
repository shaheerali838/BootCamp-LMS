import React from "react";
import { Link } from "react-router-dom";
import { useRegistrationLog } from "../../../../context/RegistrationLogContext";

function RecentRegistrations() {
  const { registrations } = useRegistrationLog();

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
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
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
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        <div className="divide-y divide-gray-100 mt-2">
          {registrations.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-1 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center">
                  {item.name
                    ? item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : "U"}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {item.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadgeStyle(
                    item.role
                  )}`}
                >
                  {item.role}
                </span>
                <p className="text-[10px] text-gray-400 mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentRegistrations;
