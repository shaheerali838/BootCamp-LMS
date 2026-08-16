import React, { useState } from "react";
import { FiGrid, FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import { useStudent } from "../../context/StudentContext";

function TeamManagement() {
  const { students } = useStudent();
  const [search, setSearch] = useState("");

  const initialTeams = [
    { id: 1, name: "Team Alpha", leader: "Ali Hassan", membersCount: 4, batch: "Batch 11" },
    { id: 2, name: "Team Beta", leader: "Bilal Ahmed", membersCount: 3, batch: "Batch 11" },
    { id: 3, name: "Team Gamma", leader: "Sara Bilal", membersCount: 3, batch: "Batch 11" },
    { id: 4, name: "Team Delta", leader: "Usman Tariq", membersCount: 2, batch: "Batch 10" },
  ];

  const [teams, setTeams] = useState(initialTeams);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({ name: "", leader: "", batch: "Batch 11" });

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.leader.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setFormData({ name: "", leader: "", batch: "Batch 11" });
    setShowModal(true);
  };

  const handleOpenEdit = (team) => {
    setEditingTeam(team);
    setFormData({ name: team.name, leader: team.leader, batch: team.batch });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) => (t.id === editingTeam.id ? { ...t, ...formData } : t))
      );
    } else {
      setTeams((prev) => [
        ...prev,
        { ...formData, id: Date.now(), membersCount: 3 },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
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
              Create student project groups and assign team leaders
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Create Team
          </button>
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
            placeholder="Search teams or leaders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Team Name</span>
          <span>Team Leader</span>
          <span>Batch</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-2">
                <div className="font-bold text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-400">{item.membersCount} Assigned Members</div>
              </div>
              <span className="text-xs text-gray-700 font-semibold">{item.leader}</span>
              <div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {item.batch}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="hover:text-indigo-600 transition"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="hover:text-red-600 transition"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No teams found.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingTeam ? "Edit Team" : "Create Team"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Team Alpha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Team Leader Name
                </label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  placeholder="Ali Hassan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Batch Assignment
                </label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  placeholder="Batch 11"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
