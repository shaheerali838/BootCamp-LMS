import React from "react";
import { FaBullhorn } from "react-icons/fa";
import { useAnnouncement } from "../../contextAPI/Anouncement";
import AnnouncementCard from "../../components/Anouncement/AnnouncementCard";

const Announcements = () => {
  const { announcements } = useAnnouncement();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">

        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaBullhorn size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Announcements
              </h1>

              <p className="text-sm text-gray-500">
                View the latest school announcements
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Latest Announcements
            </h2>

            <span className="text-sm text-gray-500">
              {announcements.length}{" "}
              {announcements.length === 1
                ? "Announcement"
                : "Announcements"}
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className="w-full border border-dashed border-gray-300 rounded-xl p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <FaBullhorn size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No announcements yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                There are currently no announcements available.
              </p>

            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  showActions={false}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Announcements;