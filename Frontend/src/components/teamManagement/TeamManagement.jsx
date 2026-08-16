import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    FiSearch,
    FiUsers,
    FiPlus,
    FiUserCheck,
} from "react-icons/fi";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";
import TeamCard from "./TeamCard";
import CreateTeam from "./CreateTeam";

function TeamManagement() {
    const location = useLocation();
    const isSuperAdmin = location.pathname.startsWith("/superadmin");
    const { teams } = useTeamProject();

    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [search, setSearch] = useState("");

    // PAGINATION
    const teamsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);

    const totalTeams = teams.length;

    const totalMembers = teams.reduce(
        (total, team) => total + (team.members?.length || 0),
        0
    );

    const totalLeaders = teams.filter(
        (team) => team.lead && team.lead.trim() !== ""
    ).length;

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
    );

    // PAGINATION
    const totalPages = Math.ceil(
        filteredTeams.length / teamsPerPage
    );

    const startIndex =
        (currentPage - 1) * teamsPerPage;

    const currentTeams = filteredTeams.slice(
        startIndex,
        startIndex + teamsPerPage
    );

    // PAGINATION
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // PAGINATION
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

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
        <div className="min-h-screen bg-gray-50 p-2">
            <div className="mb-3 pl-3">
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
            <div className="bg-white border flex items-center justify-between border-gray-200 rounded-2xl shadow-sm p-5 mb-3">

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 min-w-[130px]">
                        <div className="flex items-center gap-2">
                            <FiUsers
                                size={16}
                                className="text-[#0476b9]"
                            />
                            <p className="text-xs text-gray-500">
                                Total Teams
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-[#0476b9]">
                            {totalTeams}
                        </p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 min-w-[130px]">
                        <div className="flex items-center gap-2">
                            <FiUsers
                                size={16}
                                className="text-green-600"
                            />
                            <p className="text-xs text-gray-500">
                                Total Members
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {totalMembers}
                        </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl px-5 py-3 min-w-[130px]">
                        <div className="flex items-center gap-2">
                            <FiUserCheck
                                size={16}
                                className="text-purple-600"
                            />
                            <p className="text-xs text-gray-500">
                                Total Leaders
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                            {totalLeaders}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FiSearch
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);

                                // PAGINATION
                                setCurrentPage(1);
                            }}
                            placeholder="Search teams..."
                            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#0476b9] focus:ring-0.5 focus:ring-[#0476b9]"
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
                        {search
                            ? "No Teams Found"
                            : "No Teams Yet"}
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

                <>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">

                        {currentTeams.map((team) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onEdit={handleEdit}
                            />
                        ))}

                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6 mb-6">

                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg font-semibold border transition ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                Previous
                            </button>

                            {/* PAGINATION */}
                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => goToPage(page)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                                        ? "bg-[#0476b9] text-white"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    goToPage(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages
                                }
                                className={`px-4 py-2 rounded-lg font-semibold border transition ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                Next
                            </button>

                        </div>
                    )}

                </>

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