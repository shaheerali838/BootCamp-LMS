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

    const batchName =
        team.batchId?.batchName ||
        (typeof team.batch === "object" ? team.batch?.batchName : null) ||
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
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between h-full">
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-gray-900 truncate">
                            {teamName}
                        </h2>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {batchName && (
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-blue-100">
                                    {batchName}
                                </span>
                            )}
                            {teamLeadName && (
                                <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-md text-[11px] font-medium border border-gray-200">
                                    Lead: <strong>{teamLeadName}</strong>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Members */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Members</span>
                        <span className="font-semibold text-gray-700">{members.length}</span>
                    </div>

                    <div className="flex items-center -space-x-2">
                        {members.slice(0, 4).map((member, idx) => {
                            const avatar = member.profilePicture || member.profileImage || member.image;
                            const memberName = member.name || member.firstName || "Member";
                            return (
                                <div
                                    key={member._id || member.id || idx}
                                    title={memberName}
                                    className="w-8 h-8 rounded-full bg-[#0476b9] text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow-2xs overflow-hidden shrink-0"
                                >
                                    {avatar ? (
                                        <img src={avatar} alt={memberName} className="w-full h-full object-cover" />
                                    ) : (
                                        getInitial(memberName)
                                    )}
                                </div>
                            );
                        })}
                        {members.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-2xs shrink-0">
                                +{members.length - 4}
                            </div>
                        )}
                        {members.length === 0 && (
                            <span className="text-xs text-gray-400 italic">No assigned members</span>
                        )}
                    </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-1.5 mt-4">
                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2 text-center">
                        <p className="text-emerald-700 font-bold text-sm">
                            {completed}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                            Completed
                        </p>
                    </div>

                    <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2 text-center">
                        <p className="text-blue-700 font-bold text-sm">
                            {progress}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                            Progress
                        </p>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2 text-center">
                        <p className="text-amber-700 font-bold text-sm">
                            {pending}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                            Pending
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => navigate(`/teams/${teamId}`)}
                    className="flex-1 border border-[#0476b9] text-[#0476b9] py-1.5 px-3 rounded-lg text-xs font-semibold hover:bg-[#0476b9] hover:text-white transition cursor-pointer text-center"
                >
                    View Details
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(team)}
                    title="Edit Team"
                    className="w-9 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg hover:bg-[#0476b9] hover:text-white hover:border-[#0476b9] transition cursor-pointer"
                >
                    <FiEdit2 size={14} />
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete Team"
                    className="w-9 h-8 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition cursor-pointer"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
        </div>
    );
}

export default TeamCard;