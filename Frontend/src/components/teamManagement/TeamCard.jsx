import React from "react";
import { useNavigate } from "react-router-dom";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function getInitial(name) {
    return name ? name.charAt(0).toUpperCase() : "?";
}

function TeamCard({ team }) {
    const navigate = useNavigate();
    const { getTeamProjects } = useTeamProject();

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

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition w-full]">
            <div className="flex items-center  justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {team.name}
                    </h2>
                    <p className="text-black/40 mt-2 text-sm">Description</p>
                    <div className="w-50 max-w-[250px] h-20 border border-gray-300 rounded-md p-2">

                        <p className="h-full text-gray-500 text-sm overflow-y-auto break-all">
                            {team?.description}
                        </p>
                    </div>
                    {team.lead && (
                        <p className="text-gray-500 text-xs mt-2">
                            Lead: <span className="font-semibold text-gray-700">{team.lead}</span>
                        </p>
                    )}
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0476b9] relative bottom-13  right-[-2px] flex items-center justify-center font-bold text-lg">
                    {getInitial(team.name.charAt(5).toUpperCase())}
                </div>
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

            <button
                onClick={() => navigate(`/teams/${team.id}`)}
                className="w-full mt-5 border border-[#0476b9] text-[#0476b9] py-2 rounded-lg hover:bg-[#0476b9] hover:text-white transition"
            >
                View Details
            </button>
        </div>
    );
}

export default TeamCard;