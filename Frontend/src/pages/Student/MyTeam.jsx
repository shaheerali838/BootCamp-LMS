import React from "react";
import { FiUsers, FiMail, FiPhone, FiStar } from "react-icons/fi";
import { useStudent } from "../../context/StudentContext";

function MyTeam() {
  const { students } = useStudent();

  // Filter team members in "Team Alpha"
  const teamMembers = students.filter(
    (student) => student.team === "Team Alpha" || student.team === "Alpha"
  );

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">My Team</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Alpha Workspace</h1>
            <p className="text-sm text-gray-500 mt-1">
              Collaborate with your teammates on assigned projects
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
            Limited Team View
          </span>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                {member.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                  {member.name}
                  {member.id === 1 && (
                    <FiStar className="text-amber-500 fill-amber-500" size={14} title="Team Lead" />
                  )}
                </h3>
                <span className="text-xs text-gray-500">{member.rollNo}</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      member.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <FiMail className="text-gray-400" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-gray-400" />
                <span>{member.phone}</span>
              </div>
            </div>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 text-sm">
            <FiUsers size={32} className="mx-auto text-gray-300 mb-2" />
            No teammates assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeam;
