import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
    FiSearch,
    FiUsers,
    FiPlus,
    FiUserCheck,
} from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";
import TeamCard from "./TeamCard";
import CreateTeam from "./CreateTeam";

function TeamManagement() {
    const location = useLocation();
    const isSuperAdmin = location.pathname.startsWith("/superadmin");
    const { teams } = useTeamProject();

    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [search, setSearch] = useState("");

    const totalTeams = teams.length;

    const totalMembers = teams.reduce(
        (total, team) => total + (team.members?.length || 0),
        0
    );

    const totalLeaders = teams.filter(
        (team) => (team.lead && String(team.lead).trim() !== "") || team.teamLead
    ).length;

    const getTeamName = (team) => team?.teamName || team?.name || "Untitled Team";

    const filteredTeams = teams.filter((team) =>
        getTeamName(team).toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        setEditingTeam(null);
        setShowModal(true);
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTeam(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="mb-3 pl-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
                    <span>{isSuperAdmin ? "Super Admin" : "Admin"}</span>
                    <span>›</span>
                    <span className="font-semibold text-gray-800">Team Management</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Team Management
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                    Create, manage and search your teams.
                </p>
            </div>

            <div className="bg-white border flex flex-wrap items-center justify-between border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 mb-4 gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 min-w-[120px]">
                        <div className="flex items-center gap-2">
                            <FiUsers
                                size={15}
                                className="text-[#0476b9]"
                            />
                            <p className="text-xs text-gray-500">
                                Total Teams
                            </p>
                        </div>
                        <p className="text-xl font-bold text-[#0476b9] mt-0.5">
                            {totalTeams}
                        </p>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 min-w-[120px]">
                        <div className="flex items-center gap-2">
                            <FiUsers
                                size={15}
                                className="text-green-600"
                            />
                            <p className="text-xs text-gray-500">
                                Total Members
                            </p>
                        </div>
                        <p className="text-xl font-bold text-green-600 mt-0.5">
                            {totalMembers}
                        </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 min-w-[120px]">
                        <div className="flex items-center gap-2">
                            <FiUserCheck
                                size={15}
                                className="text-purple-600"
                            />
                            <p className="text-xs text-gray-500">
                                Team Leads
                            </p>
                        </div>
                        <p className="text-xl font-bold text-purple-600 mt-0.5">
                            {totalLeaders}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FiSearch
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search team..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:border-[#0476b9]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="flex items-center gap-1.5 bg-[#0476b9] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#03669f] transition cursor-pointer shadow-xs shrink-0"
                    >
                        <FiPlus size={15} />
                        <span>Add Team</span>
                    </button>
                </div>
            </div>

            {/* CARD GRID (Continuous Scrollable) */}
            {filteredTeams.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center my-6">
                    <div className="flex justify-center mb-3">
                        <FiUsers
                            size={36}
                            className="text-gray-300"
                        />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-700">
                        {search ? "No Teams Found" : "No Teams Yet"}
                    </h2>

                    <p className="text-gray-500 text-xs mt-1">
                        {search
                            ? "Try searching with another team name."
                            : "Create your first team to get started."}
                    </p>

                    {!search && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="mt-4 bg-[#0476b9] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#03669f] transition cursor-pointer"
                        >
                            + Create Team
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
                    {filteredTeams.map((team) => (
                        <TeamCard
                            key={team._id || team.id}
                            team={team}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <CreateTeam
                    closeModal={closeModal}
                    editingTeam={editingTeam}
                />
            )}
        </div>
    );
}

export default TeamManagement;