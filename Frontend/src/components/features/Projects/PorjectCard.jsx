import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";

function ProjectCard({ project, team, onEdit }) {
    const navigate = useNavigate();

    const { deleteProject } = useTeamProject();

    const handleDelete = () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${project.name || project.projectName}"?`
        );

        if (confirmDelete) {
            deleteProject(project.id || project._id);
        }
    };

    // Format deadline date
    const formatDate = (date) => {
        if (!date) return "No deadline";

        const formattedDate = new Date(date);

        if (isNaN(formattedDate.getTime())) {
            return "No deadline";
        }

        return formattedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between h-full w-full">
            <div>
                {/* HEADER */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-gray-900 truncate">
                            {project.projectName || project.name || project.title || "Untitled Project"}
                        </h2>

                        <p className="text-gray-400 text-[11px] mt-1">
                            Created: {project.createdAt ? formatDate(project.createdAt) : "Today"}
                        </p>
                    </div>

                    <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border shrink-0
                            ${String(project.status).toLowerCase() === "completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : String(project.status).toLowerCase() === "in progress"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                    >
                        {String(project.status).toLowerCase() === "in progress"
                            ? "In Progress"
                            : String(project.status).toLowerCase() === "completed"
                                ? "Completed"
                                : "Pending"}
                    </span>
                </div>

                {/* TEAM INFO */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Assigned Team</span>
                    <span className="font-semibold text-[#0476b9] truncate max-w-[160px]">
                        {team?.teamName || team?.name || project.teamId?.teamName || project.team?.teamName || project.team?.name || "Unassigned"}
                    </span>
                </div>

                {/* PROJECT DATES */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-2">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium">
                            <FiCalendar size={12} />
                            <span>Start Date</span>
                        </div>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">
                            {formatDate(project.startDate)}
                        </p>
                    </div>

                    <div className="bg-red-50/60 border border-red-100 rounded-xl p-2">
                        <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-medium">
                            <FiCalendar size={12} />
                            <span>Deadline</span>
                        </div>
                        <p className="text-xs font-bold text-red-600 mt-0.5">
                            {formatDate(project.deadline)}
                        </p>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => navigate(`/projects/${project.id || project._id}`)}
                    className="flex-1 bg-[#0476b9] text-white py-1.5 px-3 rounded-lg text-xs font-semibold hover:bg-[#03669f] transition cursor-pointer text-center"
                >
                    View Details
                </button>

                <button
                    type="button"
                    onClick={() => onEdit(project)}
                    title="Edit Project"
                    className="w-9 h-8 flex items-center justify-center border border-gray-200 text-gray-600 rounded-lg hover:bg-[#0476b9] hover:text-white hover:border-[#0476b9] transition cursor-pointer"
                >
                    <FiEdit2 size={14} />
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete Project"
                    className="w-9 h-8 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition cursor-pointer"
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;