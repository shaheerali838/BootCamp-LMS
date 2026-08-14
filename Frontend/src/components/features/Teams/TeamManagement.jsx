import React, { useState } from "react";
import { FiSearch, FiUsers, FiPlus } from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";
import TeamCard from "./TeamCard";
import CreateTeam from "./CreateTeam";

function TeamManagement() {
    const { teams } = useTeamProject();

    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [search, setSearch] = useState("");

    const totalTeams = teams.length;

    const totalMembers = teams.reduce(
        (total, team) => total + (team.members?.length || 0),
        0
    );

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
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
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Team Management
                        </h1>

                        <p className="text-gray-500 text-sm mt-1">
                            Create, manage and search your teams.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 min-w-[130px]">
                            <p className="text-xs text-gray-500">
                                Total Teams
                            </p>

                            <p className="text-2xl font-bold text-[#0476b9]">
                                {totalTeams}
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 min-w-[130px]">
                            <p className="text-xs text-gray-500">
                                Total Members
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                {totalMembers}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-5">

                    <div className="relative flex-1">

                        <FiSearch
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search teams..."
                            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#0476b9] focus:ring-1 focus:ring-[#0476b9]"
                        />

                    </div>

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-2 bg-[#0476b9] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#03669f] transition"
                    >
                        <FiPlus size={20} />
                        Create Team
                    </button>

                </div>

            </div>

            {filteredTeams.length === 0 ? (

                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">

                    <div className="flex justify-center mb-3">
                        <FiUsers
                            size={40}
                            className="text-gray-300"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700">
                        {search ? "No Teams Found" : "No Teams Yet"}
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {search
                            ? "Try searching with another team name."
                            : "Create your first team to get started."}
                    </p>

                    {!search && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="mt-5 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
                        >
                            + Create Team
                        </button>
                    )}

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {filteredTeams.map((team) => (
                        <TeamCard
                            key={team.id}
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