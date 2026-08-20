import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiUser,
  FiLayers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useTeamProject } from "../../../context/TeamProjectContext";
import { useStudents } from "../../../context/AcademicContext";

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { teams, getTeamProjects, updateTeam } = useTeamProject();
  const { students = [] } = useStudents();

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const team = teams.find((team) => String(team.id || team._id) === String(id));

  const teamId = team ? team.id || team._id : null;
  const projects = teamId ? getTeamProjects(teamId) || [] : [];

  const completedProjects = projects.filter(
    (project) =>
      project.status === "completed" || project.status === "Completed",
  ).length;

  const progressProjects = projects.filter(
    (project) =>
      project.status === "in progress" || project.status === "In Progress",
  ).length;

  const pendingProjects = projects.filter(
    (project) => project.status === "pending" || project.status === "Pending",
  ).length;

  const formatDate = (date) => {
    if (!date) return "Not set";
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return "Not set";
    }
    return formattedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    if (status === "completed" || status === "Completed") {
      return "bg-green-50 text-green-700 border-green-200";
    }
    if (status === "in progress" || status === "In Progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  const getStatusLabel = (status) => {
    if (status === "in progress" || status === "In Progress") {
      return "In Progress";
    }
    if (status === "completed" || status === "Completed") {
      return "Completed";
    }
    return "Pending";
  };

  // Filter students who are NOT already team members or team lead
  const currentMemberIds = useMemo(() => {
    if (!team) return new Set();
    const ids = new Set();
    const leadId = team.teamLead?._id || team.teamLead?.id || team.teamLead;
    if (leadId) ids.add(String(leadId));
    if (Array.isArray(team.members)) {
      team.members.forEach((m) => {
        const mId = m?._id || m?.id || m;
        if (mId) ids.add(String(mId));
      });
    }
    return ids;
  }, [team]);

  const availableStudentsToAdd = useMemo(() => {
    return students.filter((s) => {
      const sId = String(s._id || s.id);
      if (currentMemberIds.has(sId)) return false;
      const query = memberSearch.toLowerCase();
      const name = (
        s.firstName ? `${s.firstName} ${s.lastName || ""}` : s.name || ""
      ).toLowerCase();
      const roll = (s.rollNumber || s.rollNo || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      return (
        name.includes(query) || roll.includes(query) || email.includes(query)
      );
    });
  }, [students, currentMemberIds, memberSearch]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !team) return;

    try {
      setIsSubmitting(true);
      const existingMembers = Array.isArray(team.members)
        ? team.members.map((m) => m?._id || m?.id || m)
        : [];
      const updatedMembers = [...existingMembers, selectedStudentId];

      await updateTeam(teamId, {
        ...team,
        members: updatedMembers,
      });

      setSelectedStudentId("");
      setShowAddMemberModal(false);
    } catch (err) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to add member.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberIdToRemove) => {
    if (!team) return;
    if (
      !window.confirm(
        "Are you sure you want to remove this member from the team?",
      )
    )
      return;

    try {
      const existingMembers = Array.isArray(team.members)
        ? team.members.map((m) => m?._id || m?.id || m)
        : [];
      const updatedMembers = existingMembers.filter(
        (mId) => String(mId) !== String(memberIdToRemove),
      );

      await updateTeam(teamId, {
        ...team,
        members: updatedMembers,
      });
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to remove member.",
      );
    }
  };

  if (!team) {
    return (
      <div className="bg-gray-50 p-4 sm:p-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0476b9] font-semibold hover:underline mb-6"
        >
          <FiArrowLeft size={18} />
          Back
        </button>

        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <FiUsers size={28} className="text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mt-5">
            Team Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The team you are looking for does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/teams")}
            className="mt-6 bg-[#0476b9] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#03669f]"
          >
            View Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-3 sm:p-5 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0476b9] font-medium transition cursor-pointer"
          >
            <FiArrowLeft size={18} />
            Back to Teams
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 sm:p-7 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 text-[#0476b9] flex items-center justify-center shrink-0">
                  <FiUsers size={32} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#0476b9] font-semibold">
                    Team Details
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 wrap-break-word">
                    {team.teamName || team.name}
                  </h1>

                  <p className="text-gray-500 text-sm mt-1">
                    {team.members?.length || 0} team members • {projects.length}{" "}
                    projects
                  </p>
                </div>
              </div>

              {Boolean(team.teamLead || team.lead) && (
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 w-fit">
                  {(() => {
                    const rawLead = team.teamLead || team.lead;
                    let leadName = "";
                    let leadAvatar = "";
                    if (typeof rawLead === "object" && rawLead) {
                      leadName = (
                        `${rawLead.firstName || ""} ${rawLead.lastName || ""}`.trim() ||
                        rawLead.name ||
                        rawLead.email ||
                        ""
                      );
                      leadAvatar = rawLead.profilePicture || rawLead.profileImage || rawLead.image || "";
                    } else if (rawLead) {
                      const found = students.find((s) => String(s._id || s.id) === String(rawLead));
                      if (found) {
                        leadName = (
                          `${found.firstName || ""} ${found.lastName || ""}`.trim() ||
                          found.name ||
                          found.email ||
                          ""
                        );
                        leadAvatar = found.profilePicture || found.profileImage || found.image || "";
                      } else if (typeof rawLead === "string" && !rawLead.match(/^[0-9a-fA-F]{24}$/)) {
                        leadName = rawLead;
                      }
                    }
                    const displayName = leadName || "Team Lead Assigned";

                    return (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#0476b9] text-white flex items-center justify-center font-bold overflow-hidden shrink-0 border border-blue-200 shadow-2xs">
                          {leadAvatar ? (
                            <img src={leadAvatar} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-medium">Team Lead</p>
                          <p className="font-semibold text-gray-800">
                            {displayName}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#0476b9]">
                  <FiUsers size={17} />
                  <span className="text-sm font-medium">Members</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {team.members?.length || 0}
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <FiFolder size={17} />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {projects.length}
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheckCircle size={17} />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {completedProjects}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-600">
                  <FiClock size={17} />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {pendingProjects}
                </p>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Team Members
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Members currently assigned to this team
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {team.members?.length || 0} Members
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentId("");
                      setMemberSearch("");
                      setShowAddMemberModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0476b9] hover:bg-[#03669f] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    <FiPlus size={14} />
                    Add Member
                  </button>
                </div>
              </div>

              {team.members?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {team.members.map((member) => {
                    const mId = member._id || member.id || member;
                    const foundStudent = students.find((s) => String(s._id || s.id) === String(mId));
                    const mName =
                      typeof member === "object"
                        ? member.firstName
                          ? `${member.firstName} ${member.lastName || ""}`.trim()
                          : member.name
                        : foundStudent
                        ? `${foundStudent.firstName || ""} ${foundStudent.lastName || ""}`.trim() || foundStudent.name
                        : "Team Member";
                    const mRoll =
                      typeof member === "object"
                        ? member.rollNumber || member.rollNo || member.email
                        : foundStudent
                        ? foundStudent.rollNumber || foundStudent.rollNo || foundStudent.email
                        : "";
                    const mAvatar =
                      (typeof member === "object" ? member.profilePicture || member.profileImage || member.image : null) ||
                      (foundStudent ? foundStudent.profilePicture || foundStudent.profileImage || foundStudent.image : "");

                    return (
                      <div
                        key={mId}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-[#0476b9] text-white flex items-center justify-center font-bold shrink-0 overflow-hidden border border-gray-100 shadow-2xs">
                            {mAvatar ? (
                              <img src={mAvatar} alt={mName} className="w-full h-full object-cover" />
                            ) : (
                              mName?.charAt(0)?.toUpperCase() || "M"
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate text-sm">
                              {mName}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400 truncate">
                              <FiUser size={12} />
                              <span>{mRoll || "Team Member"}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveMember(mId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Remove from team"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <FiUsers size={30} className="mx-auto text-gray-300" />
                  <p className="text-gray-500 text-sm mt-2">
                    No members assigned to this team yet. Click "Add Member" to
                    assign students.
                  </p>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Assigned Projects
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Projects currently assigned to {team.teamName || team.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">
                    {completedProjects} Completed
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {progressProjects} In Progress
                  </span>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                    <FiLayers size={25} className="text-gray-400" />
                  </div>

                  <h3 className="font-semibold text-gray-700 mt-4">
                    No Projects Assigned
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    This team does not have any projects assigned yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id || project._id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-bold text-gray-800 text-base leading-snug">
                            {project.projectName || project.name || project.title || "Untitled Project"}
                          </h3>

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${getStatusStyle(
                              project.status,
                            )}`}
                          >
                            {getStatusLabel(project.status)}
                          </span>
                        </div>

                        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                          {project.description ||
                            "No project description provided."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar size={14} className="text-gray-400" />
                          <span>Deadline: {formatDate(project.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0476b9] flex items-center justify-center">
                  <FiUsers size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">
                    Add Team Member
                  </h3>
                  <p className="text-xs text-gray-500">
                    Assign a student to {team.teamName || team.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Search & Select Student *
                </label>
                <input
                  type="text"
                  placeholder="Filter students by name or roll number..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 mb-2"
                />

                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-600 text-xs"
                >
                  <option value="">Choose Student</option>
                  {availableStudentsToAdd.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.firstName
                        ? `${s.firstName} ${s.lastName || ""}`
                        : s.name}{" "}
                      ({s.rollNumber || s.rollNo || s.email})
                    </option>
                  ))}
                </select>

                {availableStudentsToAdd.length === 0 && (
                  <p className="text-gray-400 text-[11px] mt-1.5">
                    No remaining students available to add.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudentId || isSubmitting}
                  className="px-5 py-2 bg-[#0476b9] hover:bg-[#03669f] text-white font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add to Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamDetail;
