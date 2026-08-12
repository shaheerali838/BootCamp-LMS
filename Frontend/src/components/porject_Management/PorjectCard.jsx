import React from "react";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project, team }) {
    const navigate = useNavigate();

    const handleDetails = () => {
        navigate(`/projects/${project.id}`);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">

                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {project.name}
                    </h2>
                    <div>
                        <h1>{project.lead}</h1>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {project.description || "No description available"}
                    </p>

                </div>

                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${project.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : project.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    {project.status}
                </span>

            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">

                <p className="text-xs text-gray-500">
                    Assigned Team
                </p>

                <p className="font-semibold text-[#0476b9] mt-1">
                    {team?.name || "Unknown Team"}
                </p>

            </div>

            <div className="flex items-center justify-between mt-5">

                <div>

                    <p className="text-xs text-gray-400">
                        Current Status
                    </p>

                    <p
                        className={`text-sm font-semibold mt-1 ${project.status === "Completed"
                                ? "text-green-600"
                                : project.status === "In Progress"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                            }`}
                    >
                        {project.status}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleDetails}
                    className="bg-[#0476b9] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#03669f] transition"
                >
                    View Details
                </button>

            </div>

        </div>
    );
}

export default ProjectCard;