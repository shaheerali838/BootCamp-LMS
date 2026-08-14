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

    const teamProjects = getTeamProjects(team.id);

    const completed = teamProjects.filter(
        (project) => project.status === "Completed"
    ).length;

    const progress = teamProjects.filter(
        (project) => project.status === "In Progress"
    ).length;

    const pending = teamProjects.filter(
        (project) => project.status === "Pending"
    ).length;

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${team.name}?`
        );

        if (confirmDelete) {
            deleteTeam(team.id);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition w-full">

            <div className="flex items-center justify-between">

                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {team.name}
                    </h2>

                    <p className="text-black/40 mt-2 text-sm">
                        Description
                    </p>

                    <div className="w-[250px] h-20 border border-gray-300 rounded-md p-2">
                        <p className="h-full text-gray-500 text-sm overflow-y-auto overflow-x-hidden break-all">
                            {team?.description}
                        </p>
                    </div>

                    {team.lead && (
                        <p className="text-gray-500 text-xs mt-2">
                            Lead:{" "}
                            <span className="font-semibold text-gray-700">
                                {team.lead}
                            </span>
                        </p>
                    )}
                </div>

                {/* <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-100 text-[#0476b9] flex items-center justify-center font-bold text-lg">
                    {getInitial(team.name)}
                </div> */}
            </div>

            <p className="text-gray-500 text-sm py-2">
                Members: {team.members.length}
            </p>

            <div className="flex -space-x-2">
                {team.members.slice(0, 4).map((member) => (
                    <div
                        key={member.id}
                        className="w-9 h-9 rounded-full bg-[#0476b9] text-white flex items-center justify-center text-sm font-semibold border-2 border-white"
                    >
                        {getInitial(member.name)}
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

            <div className="flex gap-2 mt-5">

                <button
                    type="button"
                    onClick={() => navigate(`/teams/${team.id}`)}
                    className="flex-1 border border-[#0476b9] text-[#0476b9] py-2 rounded-lg hover:bg-[#0476b9] hover:text-white transition"
                >
                    View Details
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(team)}
                    title="Edit Team"
                    className="w-11 h-10 flex items-center justify-center border border-gray-300 text-gray-600 rounded-lg hover:bg-[#0476b9] hover:text-white hover:border-[#0476b9] transition"
                >
                    <FiEdit2 size={18} />
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete Team"
                    className="w-11 h-10 flex items-center justify-center border border-red-300 text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                >
                    <FiTrash2 size={18} />
                </button>

            </div>

        </div>
    );
}

export default TeamCard;