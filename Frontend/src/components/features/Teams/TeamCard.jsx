import React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function getInitial(name) {
    return name ? name.charAt(0).toUpperCase() : "?";
}

function TeamCard({ team, onEdit }) {
    const navigate = useNavigate();

    const {
        getTeamProjects,
        deleteTeam,
    } = useTeamProject();

    const teamId = team._id || team.id;
    const teamName = team.teamName || team.name || "Untitled Team";
    const teamProjects = getTeamProjects(teamId);

    const completed = teamProjects.filter(
        (project) => project.status === "Completed"
    ).length;

    const progress = teamProjects.filter(
        (project) => project.status === "In Progress"
    ).length;

    const pending = teamProjects.filter(
        (project) => project.status === "Pending"
    ).length;

    const members = team.members || [];
    const teamLeadName =
        team.teamLead?.name ||
        (team.teamLead?.firstName ? `${team.teamLead.firstName} ${team.teamLead.lastName || ""}` : null) ||
        team.lead ||
        null;

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${teamName}?`
        );

        if (confirmDelete) {
            deleteTeam(teamId);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition w-full">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {teamName}
                    </h2>

                    <p className="text-gray-500 text-sm mt-4">
                        Description
                    </p>

                    <div className="w-full h-20 border border-gray-300 rounded-md p-2 mt-1">
                        <p className="h-full w-full text-gray-500 text-sm overflow-y-auto overflow-x-hidden break-all">
                            {team?.description || "No description available"}
                        </p>
                    </div>

                    {teamLeadName && (
                        <p className="text-gray-500 text-xs mt-2">
                            Lead:{" "}
                            <span className="font-semibold text-gray-700">
                                {teamLeadName}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <p className="text-gray-500 text-sm py-2">
                Members: {members.length}
            </p>

            <div className="flex -space-x-2">
                {members.slice(0, 4).map((member, idx) => (
                    <div
                        key={member._id || member.id || idx}
                        className="w-9 h-9 rounded-full bg-[#0476b9] text-white flex items-center justify-center text-sm font-semibold border-2 border-white"
                    >
                        {getInitial(member.name || member.firstName)}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-green-600 font-bold">
                        {completed}
                    </p>
                    <p className="text-xs text-gray-500">
                        Completed
                    </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-blue-600 font-bold">
                        {progress}
                    </p>
                    <p className="text-xs text-gray-500">
                        Progress
                    </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-2 text-center">
                    <p className="text-yellow-600 font-bold">
                        {pending}
                    </p>
                    <p className="text-xs text-gray-500">
                        Pending
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    type="button"
                    onClick={() => navigate(`/teams/${teamId}`)}
                    className="flex-1 border border-[#0476b9] text-[#0476b9] py-2 rounded-lg hover:bg-[#0476b9] hover:text-white transition cursor-pointer"
                >
                    View Details
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(team)}
                    title="Edit Team"
                    className="w-11 h-10 flex items-center justify-center border border-gray-300 text-gray-600 rounded-lg hover:bg-[#0476b9] hover:text-white hover:border-[#0476b9] transition cursor-pointer"
                >
                    <FiEdit2 size={18} />
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete Team"
                    className="w-11 h-10 flex items-center justify-center border border-red-300 text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition cursor-pointer"
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default TeamCard;