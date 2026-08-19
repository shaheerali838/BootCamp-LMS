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
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition w-full">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">

                <div className="min-w-0 flex-1">

                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {project.projectName || project.name || project.title || "Untitled Project"}
                    </h2>

                    <p className="text-gray-400 text-xs mt-1">
                        Created:{" "}
                        {project.createdAt
                            ? formatDate(project.createdAt)
                            : "Today"}
                    </p>

                </div>

                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
                        ${project.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : project.status === "in progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                >
                    {project.status === "in progress"
                        ? "In Progress"
                        : project.status === "completed"
                            ? "Completed"
                            : "Pending"}
                </span>

            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm mt-4">
                Description
            </p>

            <div className="w-full h-20 border border-gray-300 rounded-md p-2 mt-1">

                <p className="h-full text-gray-500 text-sm overflow-y-auto overflow-x-hidden break-all">
                    {project.description || "No description available"}
                </p>

            </div>

            {/* PROJECT DATES */}
            <div className="grid grid-cols-2 gap-3 mt-4">

                {/* START DATE */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">

                    <div className="flex items-center gap-2 text-gray-500">
                        <FiCalendar size={15} />

                        <span className="text-xs">
                            Start Date
                        </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-700 mt-1">
                        {formatDate(project.startDate)}
                    </p>

                </div>

                {/* DEADLINE */}
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">

                    <div className="flex items-center gap-2 text-red-500">
                        <FiCalendar size={15} />

                        <span className="text-xs">
                            Deadline
                        </span>
                    </div>

                    <p className="text-sm font-semibold text-red-600 mt-1">
                        {formatDate(project.deadline)}
                    </p>

                </div>

            </div>

            {/* TEAM */}
            <div className="mt-5 border-t border-gray-100 pt-4">

                <p className="text-xs text-gray-500">
                    Assigned Team
                </p>

                <p className="font-semibold text-[#0476b9] mt-1">
                    {team?.teamName || team?.name || project.teamId?.teamName || project.team?.teamName || project.team?.name || "Unassigned"}
                </p>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-5">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/projects/${project.id || project._id}`
                        )
                    }
                    className="flex-1 bg-[#0476b9] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#03669f] transition"
                >
                    View Details
                </button>

                {/* EDIT */}
                <button
                    type="button"
                    onClick={() => onEdit(project)}
                    title="Edit Project"
                    className="w-11 h-10 flex items-center justify-center border border-gray-300 text-gray-600 rounded-lg hover:bg-[#0476b9] hover:text-white transition"
                >
                    <FiEdit2 size={18} />
                </button>

                {/* DELETE */}
                <button
                    type="button"
                    onClick={handleDelete}
                    title="Delete Project"
                    className="w-11 h-10 flex items-center justify-center border border-red-300 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                    <FiTrash2 size={18} />
                </button>

            </div>

        </div>
    );
}

export default ProjectCard;