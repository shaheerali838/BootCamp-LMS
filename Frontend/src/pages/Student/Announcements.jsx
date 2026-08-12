import React from "react";
import { FiBell, FiCalendar, FiUser, FiTag } from "react-icons/fi";

function Announcements() {
  const announcementsList = [
    {
      id: 1,
      title: "Mid-Term Hackathon Guidelines & Repo Submission",
      date: "August 12, 2026",
      author: "Sir Bilal",
      category: "Hackathon",
      content:
        "All student teams are required to submit their final GitHub repository links before Friday midnight. Ensure your README file includes setup instructions and component list.",
    },
    {
      id: 2,
      title: "Guest Speaker Session: Microservices in Node.js",
      date: "August 10, 2026",
      author: "Bootcamp Management",
      category: "Event",
      content:
        "Join us this coming Saturday at 3:00 PM for an interactive webinar with industry experts. Attendance is highly encouraged for senior batch students.",
    },
    {
      id: 3,
      title: "Module 3 Attendance Qualification Requirement",
      date: "August 08, 2026",
      author: "Sir Ahmed",
      category: "Academic",
      content:
        "Please note that a minimum 80% attendance record is compulsory to be eligible for final project evaluation and certificate issuance.",
    },
    {
      id: 4,
      title: "Saylani Tech Community Meetup 2026",
      date: "August 04, 2026",
      author: "SMIT Admin",
      category: "General",
      content:
        "Registration for the annual Saylani Alumni & Student Meetup is now open. Seats are limited, so reserve your badge early.",
    },
  ];

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">Announcements</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
            <p className="text-sm text-gray-500 mt-1">
              Official updates, events, and academic announcements
            </p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-medium">
            View Only Access
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {announcementsList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                <FiTag size={12} />
                {item.category}
              </span>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <FiUser size={13} />
                  {item.author}
                </span>
                <span className="flex items-center gap-1">
                  <FiCalendar size={13} />
                  {item.date}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;
