import React, { useState } from "react";
import { FiSliders, FiSave, FiCheckCircle } from "react-icons/fi";

function SystemConfiguration() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    systemName: "Saylani Mass IT Training (SMIT) LMS",
    academicYear: "2026",
    allowSelfRegistration: true,
    minAttendanceThreshold: 80,
    maxTeamMembers: 5,
    maintenanceMode: false,
    smtpHost: "smtp.smit.edu.pk",
    notificationEmail: "alerts@smit.edu.pk",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-5 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
       
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiSliders className="text-purple-600" />
              System Settings & Global Configurations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure system parameters, qualification thresholds, and operational rules
            </p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold">
          <FiCheckCircle size={18} />
          System configuration saved successfully!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-4">
            General System Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                LMS Portal Name
              </label>
              <input
                type="text"
                value={config.systemName}
                onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Academic Year
              </label>
              <input
                type="text"
                value={config.academicYear}
                onChange={(e) => setConfig({ ...config, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-4">
            Academic & Attendance Thresholds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Minimum Qualification Attendance (%)
              </label>
              <input
                type="number"
                value={config.minAttendanceThreshold}
                onChange={(e) => setConfig({ ...config, minAttendanceThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Max Members per Project Team
              </label>
              <input
                type="number"
                value={config.maxTeamMembers}
                onChange={(e) => setConfig({ ...config, maxTeamMembers: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 border-b pb-2 mb-4">
            System Operational Toggles
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowSelfRegistration}
                onChange={(e) => setConfig({ ...config, allowSelfRegistration: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm font-medium text-gray-800">
                Allow new student self-registration portal
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm font-medium text-gray-800">
                Enable Maintenance Mode (Restricts student login)
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow transition"
          >
            <FiSave size={16} />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default SystemConfiguration;
