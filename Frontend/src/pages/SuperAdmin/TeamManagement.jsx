import React, { useState } from "react";
import { FiGrid, FiPlus, FiTrash2, FiEdit2, FiSearch, FiLayers, FiUsers, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useBatches, useStudents } from "../../context/AcademicContext";
import CreateTeam from "../../components/features/Teams/CreateTeam";

function TeamManagement() {
  const { teams = [], teamsLoading, teamsError, deleteTeam } = useTeamProject();
  const { batches = [] } = useBatches();
  const { students = [] } = useStudents();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const getTeamName = (t) => t.teamName || t.name || "Untitled Team";
  const getLeaderName = (t) => {
    if (t.teamLead && typeof t.teamLead === "object") {
      return t.teamLead.firstName
        ? `${t.teamLead.firstName} ${t.teamLead.lastName || ""}`.trim()
        : t.teamLead.name || t.teamLead.email || "Assigned Lead";
    }
    const found = students.find((s) => (s._id || s.id) === (t.teamLead || t.lead));
    if (found) {
      return found.firstName ? `${found.firstName} ${found.lastName || ""}`.trim() : found.name;
    }
    return t.lead || "Unassigned";
  };

  const getBatchName = (t) => {
    if (t.batchId && typeof t.batchId === "object" && t.batchId.batchName) {
      return t.batchId.batchName;
    }
    const bId = t.batchId?._id || t.batchId || t.batch?._id || t.batch;
    const found = batches.find((b) => (b._id || b.id) === bId);
    return found ? found.batchName : "General";
  };

  const getMembersCount = (t) => {
    if (Array.isArray(t.members)) return t.members.length;
    return 0;
  };

  const filtered = teams.filter((t) => {
    const q = search.toLowerCase();
    const name = getTeamName(t).toLowerCase();
    const leader = getLeaderName(t).toLowerCase();
    const batch = getBatchName(t).toLowerCase();
    return name.includes(q) || leader.includes(q) || batch.includes(q);
  });

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setShowModal(true);
  };

  const handleOpenEdit = (team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(id);
      } catch (err) {
        alert(err?.response?.data?.message || err?.message || "Failed to delete team");
      }
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiGrid className="text-indigo-600" />
              Team Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create student project groups, assign mentors and team leaders
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow transition cursor-pointer"
          >
            <FiPlus size={16} />
            Create Team
          </button>
        </div>
      </div>

      {teamsError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 text-sm">
          <FiAlertCircle size={18} />
          {teamsError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{teams.length}</h2>
            <p className="text-xs text-gray-500 uppercase mt-0.5">Total Teams</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiGrid size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-2xl font-bold text-emerald-600">
              {teams.filter((t) => (t.status || "active").toLowerCase() === "active").length}
            </h2>
            <p className="text-xs text-gray-500 uppercase mt-0.5">Active Teams</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiUsers size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">{batches.length}</h2>
            <p className="text-xs text-gray-500 uppercase mt-0.5">Active Batches</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiLayers size={18} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by team name, leader, or batch..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative min-h-40">
        {teamsLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <FiLoader size={24} className="text-indigo-600 animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Team Name</span>
          <span>Team Leader</span>
          <span>Batch</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item._id || item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm transition">
              <div className="col-span-2">
                <div className="font-bold text-gray-900">{getTeamName(item)}</div>
                <div className="text-xs text-gray-400">{getMembersCount(item)} Assigned Members</div>
              </div>
              <span className="text-xs text-gray-700 font-semibold">{getLeaderName(item)}</span>
              <div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {getBatchName(item)}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-indigo-600 transition cursor-pointer"
                  title="Edit Team"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item._id || item.id)}
                  className="hover:text-red-600 transition cursor-pointer"
                  title="Delete Team"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {!teamsLoading && filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">
              No teams created yet. Click "Create Team" to add your first project group.
            </div>
          )}
        </div>
      </div>

      {/* Real Team Modal */}
      {showModal && (
        <CreateTeam
          closeModal={() => setShowModal(false)}
          initialData={editingTeam}
          editingTeam={editingTeam}
        />
      )}
    </div>
  );
}

export default TeamManagement;
