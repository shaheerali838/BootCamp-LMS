import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiFolder,
  FiUsers,
  FiLayers,
  FiUserCheck,
} from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { useStudents } from "../../../context/AcademicContext";
import ProjectCard from "./PorjectCard";

function ProjectManagement() {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith("/superadmin");
  const {
    teams,
    projects,
    addProject,
    updateProject,
    fetchTeams,
    fetchProjects,
  } = useTeamProject();
  const { students = [] } = useStudents();

  useEffect(() => {
    if (fetchTeams) fetchTeams();
    if (fetchProjects) fetchProjects();
  }, [fetchTeams, fetchProjects]);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");


  // --------------------------------
  // PAGINATION
  // --------------------------------
  const projectsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // --------------------------------
  // FORM DATA
  // --------------------------------
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    deadline: "",
    batch: "",
    status: "pending",
    members: [],
  });

  // --------------------------------
  // TOTAL MEMBERS
  // --------------------------------
  const totalMembers = teams.reduce(
    (total, team) =>
      total + (team.members?.length || 0) + (team.teamLead || team.lead ? 1 : 0),
    0
  );

  // --------------------------------
  // TOTAL LEADERS
  // --------------------------------
  const totalLeaders = teams.filter(
    (team) => Boolean(team.teamLead || team.lead)
  ).length;

  // --------------------------------
  // SEARCH PROJECTS
  // --------------------------------
  const filteredProjects = projects.filter((project) =>
    (
      project.name ||
      project.projectName ||
      ""
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // --------------------------------
  // PAGINATION
  // --------------------------------
  const totalPages = Math.ceil(
    filteredProjects.length / projectsPerPage
  );

  const startIndex =
    (currentPage - 1) * projectsPerPage;

  const currentProjects =
    filteredProjects.slice(
      startIndex,
      startIndex + projectsPerPage
    );

  // --------------------------------
  // FIX CURRENT PAGE
  // --------------------------------
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // --------------------------------
  // GO TO PAGE
  // --------------------------------
  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  // --------------------------------
  // RESET FORM
  // --------------------------------
  const resetForm = () => {
    setFormData({
      projectName: "",
      description: "",
      startDate: "",
      deadline: "",
      batch: "",
      status: "pending",
      members: [],
    });
  };

  // --------------------------------
  // CREATE PROJECT
  // --------------------------------
  const handleCreate = () => {
    setEditingProject(null);
    resetForm();
    setShowForm(true);
  };

  // --------------------------------
  // EDIT PROJECT
  // --------------------------------
  const handleEdit = (project) => {
    setEditingProject(project);

    const selectedTeamId =
      project.teamId?._id ||
      project.teamId?.id ||
      (typeof project.teamId === "string" ? project.teamId : "") ||
      project.batch?._id ||
      project.batch?.id ||
      (typeof project.batch === "string" ? project.batch : "") ||
      project.batchId ||
      "";

    // Find selected team
    const selectedTeam = teams.find(
      (team) =>
        String(
          team._id || team.id
        ) ===
        String(selectedTeamId)
    );

    setFormData({
      projectName:
        project.projectName ||
        project.name ||
        "",

      description:
        project.description || "",

      startDate:
        project.startDate
          ? String(
            project.startDate
          ).slice(0, 10)
          : "",

      deadline:
        project.deadline
          ? String(
            project.deadline
          ).slice(0, 10)
          : "",

      batch: selectedTeamId,

      status:
        project.status ||
        "pending",

      // Load members from selected team
      members:
        selectedTeam?.members ||
        project.members ||
        [],
    });

    setShowForm(true);
  };

  // --------------------------------
  // CLOSE FORM
  // --------------------------------
  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
    resetForm();
  };

  // --------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------
  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    // --------------------------------
    // WHEN TEAM CHANGES
    // GET ONLY MEMBERS OF THAT TEAM
    // --------------------------------
    if (name === "batch") {
      const selectedTeam =
        teams.find(
          (team) =>
            String(
              team._id || team.id
            ) === String(value)
        );

      setFormData({
        ...formData,

        batch: value,

        // Only members already
        // inside selected team
        members:
          selectedTeam?.members ||
          [],
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // --------------------------------
  // SUBMIT PROJECT
  // --------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    // --------------------------------
    // REQUIRED VALIDATION
    // --------------------------------
    if (
      !formData.projectName.trim() ||
      !formData.description.trim() ||
      !formData.startDate ||
      !formData.deadline ||
      !formData.batch
    ) {
      alert(
        "Please fill all required fields"
      );

      return;
    }

    // --------------------------------
    // DATE VALIDATION
    // --------------------------------
    if (
      new Date(formData.deadline) <
      new Date(formData.startDate)
    ) {
      alert(
        "Deadline must be after start date"
      );

      return;
    }

    // --------------------------------
    // PROJECT DATA
    // --------------------------------
    const projectData = {
      projectName:
        formData.projectName,

      name:
        formData.projectName,

      description:
        formData.description,

      startDate:
        formData.startDate,

      deadline:
        formData.deadline,

      batch:
        formData.batch,

      teamId:
        formData.batch,

      status:
        formData.status,

      // IMPORTANT:
      // Only members from selected team
      members:
        formData.members,
    };

    // --------------------------------
    // UPDATE PROJECT
    // --------------------------------
    if (editingProject) {
      const projectId =
        editingProject.id ||
        editingProject._id;

      updateProject(
        projectId,
        projectData
      );
    }

    // --------------------------------
    // CREATE PROJECT
    // --------------------------------
    else {
      addProject(projectData);

      // Go to first page
      setCurrentPage(1);
    }

    closeForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">

      {/* -------------------------------- */}
      {/* PAGE HEADER */}
      {/* -------------------------------- */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3 px-3">

        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
            <span>{isSuperAdmin ? "Super Admin" : "Admin"}</span>
            <span>›</span>
            <span className="font-semibold text-gray-800">Project Management</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Project Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create, manage and track your projects.
          </p>
        </div>

      </div>

      {/* -------------------------------- */}
      {/* STATISTICS + SEARCH */}
      {/* -------------------------------- */}

      <div className="bg-white border flex items-center justify-between border-gray-200 rounded-2xl shadow-sm p-5 mb-3">

        {/* STATISTICS */}

        <div className="flex flex-wrap items-center gap-3">

          {/* TOTAL PROJECTS */}

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 min-w-[130px]">

            <div className="flex items-center gap-2">

              <FiFolder
                size={16}
                className="text-[#0476b9]"
              />

              <p className="text-xs text-gray-500">
                Total Projects
              </p>

            </div>

            <p className="text-2xl font-bold text-[#0476b9]">
              {projects.length}
            </p>

          </div>

          {/* TOTAL TEAMS */}

          <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 min-w-[130px]">

            <div className="flex items-center gap-2">

              <FiLayers
                size={16}
                className="text-green-600"
              />

              <p className="text-xs text-gray-500">
                Total Teams
              </p>

            </div>

            <p className="text-2xl font-bold text-green-600">
              {teams.length}
            </p>

          </div>

          {/* TOTAL LEADERS */}

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

          {/* TOTAL MEMBERS */}

          <div className="bg-orange-50 border border-orange-100 rounded-xl px-5 py-3 min-w-[130px]">

            <div className="flex items-center gap-2">

              <FiUsers
                size={16}
                className="text-orange-600"
              />

              <p className="text-xs text-gray-500">
                Total Members
              </p>

            </div>

            <p className="text-2xl font-bold text-orange-600">
              {totalMembers}
            </p>

          </div>

        </div>

        {/* SEARCH + ADD */}

        <div className="flex flex-col sm:flex-row gap-3">

          <div className="relative flex-1">

            <FiSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#0476b9] focus:ring-0.5 focus:ring-[#0476b9]"
            />

          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
          >
            <FiPlus size={18} />

            Add Project
          </button>

        </div>

      </div>

      {/* -------------------------------- */}
      {/* NO PROJECTS */}
      {/* -------------------------------- */}

      {filteredProjects.length === 0 ? (

        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mt-3">

          <FiFolder
            size={40}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-xl font-semibold text-gray-700 mt-3">
            {search
              ? "No Projects Found"
              : "No Projects Yet"}
          </h2>

          <p className="text-gray-500 mt-2">
            {search
              ? "Try another search."
              : "Create your first project."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-5 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
            >
              + Create Project
            </button>
          )}

        </div>

      ) : (

        <>

          {/* -------------------------------- */}
          {/* PROJECT CARDS */}
          {/* -------------------------------- */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">

            {currentProjects.map(
              (project) => {
                const projectTeamId =
                  project.teamId?._id ||
                  project.teamId?.id ||
                  (typeof project.teamId === "string" ? project.teamId : null) ||
                  project.batch?._id ||
                  project.batch?.id ||
                  (typeof project.batch === "string" ? project.batch : null) ||
                  project.batchId;

                const team =
                  teams.find(
                    (t) =>
                      String(t._id || t.id) === String(projectTeamId)
                  ) ||
                  (project.teamId && typeof project.teamId === "object"
                    ? project.teamId
                    : null);

                return (
                  <ProjectCard
                    key={
                      project._id ||
                      project.id
                    }
                    project={project}
                    team={team}
                    onEdit={handleEdit}
                  />
                );
              }
            )}

          </div>

          {/* -------------------------------- */}
          {/* PAGINATION */}
          {/* -------------------------------- */}

          {totalPages > 1 && (

            <div className="flex items-center justify-center gap-2 mt-6 mb-6">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                className={`px-4 py-2 rounded-lg font-semibold border transition ${currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                Previous
              </button>

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    goToPage(page)
                  }
                  className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                      ? "bg-[#0476b9] text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>

              ))}

              {/* NEXT */}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className={`px-4 py-2 rounded-lg font-semibold border transition ${currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                Next
              </button>

            </div>

          )}

        </>

      )}

      {/* -------------------------------- */}
      {/* CREATE / EDIT PROJECT MODAL */}
      {/* -------------------------------- */}

      {showForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">

                  {editingProject
                    ? "Edit Project"
                    : "Create Project"}

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {editingProject
                    ? "Update project information."
                    : "Create a new project."}

                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* PROJECT NAME */}

              <label className="block text-sm font-semibold text-gray-700">
                Project Name
              </label>

              <input
                type="text"
                name="projectName"
                value={
                  formData.projectName
                }
                onChange={handleChange}
                placeholder="Enter project name"
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              {/* DESCRIPTION */}

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Enter project description"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              {/* START DATE */}

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={
                  formData.startDate
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              {/* DEADLINE */}

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={
                  formData.deadline
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              />

              {/* TEAM / BATCH */}

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Team
              </label>

              <select
                name="batch"
                value={
                  formData.batch
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              >

                <option value="">
                  Select Team
                </option>

                {teams.map(
                  (team) => (

                    <option
                      key={
                        team._id ||
                        team.id
                      }
                      value={
                        team._id ||
                        team.id
                      }
                    >
                      {team.teamName || team.name || `Team ${team._id || team.id}`}
                    </option>

                  )
                )}

              </select>

              {/* -------------------------------- */}
              {/* PROJECT MEMBERS */}
              {/* -------------------------------- */}
              {/* PROJECT MEMBERS */}
              {/* -------------------------------- */}

              {formData.batch && (() => {
                const selectedTeam = teams.find(
                  (t) => String(t._id || t.id) === String(formData.batch)
                );

                const list = [];
                if (selectedTeam?.teamLead) {
                  list.push({
                    raw: selectedTeam.teamLead,
                    isLead: true,
                  });
                }
                if (Array.isArray(selectedTeam?.members)) {
                  selectedTeam.members.forEach((m) => {
                    const mId = String(m._id || m.id || m);
                    const leadId = String(selectedTeam.teamLead?._id || selectedTeam.teamLead?.id || selectedTeam.teamLead || "");
                    if (mId !== leadId) {
                      list.push({ raw: m, isLead: false });
                    }
                  });
                }

                const resolveMember = (item) => {
                  const raw = item.raw;
                  if (typeof raw === "object" && (raw.firstName || raw.name)) {
                    const name = raw.firstName
                      ? `${raw.firstName} ${raw.lastName || ""}`.trim()
                      : raw.name;
                    const roll = raw.rollNumber || raw.rollNo || raw.email || "";
                    return { name, roll };
                  }
                  const rawId = String(raw?._id || raw?.id || raw);
                  const found = students.find((s) => String(s._id || s.id) === rawId);
                  if (found) {
                    const name = found.firstName
                      ? `${found.firstName} ${found.lastName || ""}`.trim()
                      : found.name;
                    const roll = found.rollNumber || found.rollNo || found.email || "";
                    return { name, roll };
                  }
                  return { name: "Team Member", roll: "" };
                };

                return (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-gray-700">
                        Project Members
                      </label>
                      <span className="text-xs text-gray-500 font-medium">
                        {list.length} Members
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 max-h-48 overflow-y-auto">
                      {list.length > 0 ? (
                        <div className="space-y-2">
                          {list.map((item, idx) => {
                            const { name, roll } = resolveMember(item);
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                    item.isLead ? "bg-blue-600 text-white" : "bg-gray-100 text-[#0476b9]"
                                  }`}>
                                    {name.charAt(0).toUpperCase()}
                                  </div>

                                  <div className="min-w-0">
                                    <span className="text-xs font-semibold text-gray-800 truncate block">
                                      {name}
                                    </span>
                                    {roll && (
                                      <span className="text-[10px] text-gray-400 block truncate">
                                        {roll}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  item.isLead
                                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                                    : "bg-gray-100 text-gray-500"
                                }`}>
                                  {item.isLead ? "Team Lead" : "Member"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 py-1">
                          No members assigned to this team yet.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* STATUS */}

              <label className="block text-sm font-semibold text-gray-700 mt-4">
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 outline-none focus:border-[#0476b9]"
              >

                <option value="pending">
                  Pending
                </option>

                <option value="in progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

              </select>

              {/* BUTTONS */}

              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-[#0476b9] text-white py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
                >

                  {editingProject
                    ? "Update Project"
                    : "Create Project"}

                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProjectManagement;