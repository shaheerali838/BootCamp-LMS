import React from "react";
import { Link } from "react-router-dom";

function AttendancePreview({ attendance }) {
  const data = attendance || [
    {
      id: 1,
      name: "Ayesha Khan",
      team: "Team Alpha",
      rollNo: "WM-10295",
      time: "09:15 AM",
      status: "Late",
      initials: "AK",
    },
    {
      id: 2,
      name: "Ali Ahmed",
      team: "Team Alpha",
      rollNo: "WM-10294",
      time: "08:55 AM",
      status: "Present",
      initials: "AA",
    },
    {
      id: 3,
      name: "Saad Tariq",
      team: "Team Beta",
      rollNo: "WM-10297",
      time: "08:45 AM",
      status: "Present",
      initials: "ST",
    },
    {
      id: 4,
      name: "Usman Bilal",
      team: "Team Gamma",
      rollNo: "WM-10296",
      time: "--:-- AM",
      status: "Absent",
      initials: "UB",
    },
  ];

  
  const sortedData = [...data].sort((a, b) => {
    const priority = {
      Late: 1,
      Present: 2,
      Absent: 3,
    };

    return priority[a.status] - priority[b.status];
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-600";

      case "Late":
        return "bg-orange-100 text-orange-600";

      case "Absent":
        return "bg-red-100 text-red-500";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Today's Attendance
        </h2>

        <Link
          to="/attendance"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

    
      <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
        <span>Student</span>
        <span>Team</span>
        <span>Roll No.</span>
        <span>Time</span>
        <span className="text-right">Status</span>
      </div>

      
      {sortedData.map((student) => (
        <div
          key={student.id}
          className="grid grid-cols-5 items-center px-5 py-3 border-t border-gray-100"
        >
       
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
              {student.initials}
            </div>

            <span className="text-sm font-medium text-gray-800">
              {student.name}
            </span>
          </div>

  
          <span className="text-sm text-gray-500">
            {student.team}
          </span>

         
          <span className="text-sm text-gray-500">
            {student.rollNo}
          </span>

         
          <span className="text-sm text-gray-500">
            {student.time}
          </span>

      
          <div className="flex justify-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                student.status
              )}`}
            >
              {student.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AttendancePreview;