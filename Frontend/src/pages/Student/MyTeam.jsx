import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiClock,
  FiFolder,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCheckCircle,
  FiLayers,
  FiActivity,
  FiInfo,
} from "react-icons/fi";
import { useTeamProject } from "../../context/TeamProjectContext";
import { useStudent, useBatches } from "../../context/AcademicContext";
import { useAuth } from "../../context/AuthContext";

function MyTeam() {
  const { user } = useAuth();
  const {
    teams = [],
    projects = [],
    fetchTeams,
    fetchProjects,
  } = useTeamProject();
  const { students = [], fetchStudents } = useStudent();
  const { batches = [], fetchBatches } = useBatches();

  useEffect(() => {
    if (fetchTeams) fetchTeams();
    if (fetchProjects) fetchProjects();
    if (fetchStudents) fetchStudents();
    if (fetchBatches) fetchBatches();
  }, [fetchTeams, fetchProjects, fetchStudents, fetchBatches]);

  const studentId = String(user?._id || user?.id || "");
  const studentRoll = String(
    user?.rollNumber || user?.rollNo || "",
  ).toLowerCase();
  const studentEmail = String(user?.email || "").toLowerCase();
  const studentName = String(
    user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`
      : user?.name || "",
  )
    .trim()
    .toLowerCase();

  // Helper to resolve student lead details (name, roll, email, phone, avatar)
  const resolveStudentLead = (raw) => {
    if (!raw)
      return {
        name: "Unassigned",
        roll: "",
        email: "",
        phone: "",
        avatar: "",
        isSelf: false,
      };
    if (typeof raw === "object" && raw) {
      const fullName =
        `${raw.firstName || ""} ${raw.lastName || ""}`.trim() ||
        raw.name ||
        raw.email ||
        "Team Lead";
      const roll = raw.rollNumber || raw.rollNo || "";
      const email = raw.email || "";
      const phone = raw.phoneNumber || raw.phone || "";
      const avatar = raw.profilePicture || raw.profileImage || raw.image || "";
      const rawId = String(raw._id || raw.id || "");
      const isSelf =
        (studentId && rawId === studentId) ||
        (studentRoll && roll && roll.toLowerCase() === studentRoll) ||
        (studentEmail && email && email.toLowerCase() === studentEmail);
      return { name: fullName, roll, email, phone, avatar, isSelf };
    }

    const rawId = String(raw?._id || raw?.id || raw || "");
    const found = students.find((s) => String(s._id || s.id) === rawId);
    if (found) {
      const fullName =
        `${found.firstName || ""} ${found.lastName || ""}`.trim() ||
        found.name ||
        found.email ||
        "Team Lead";
      const roll = found.rollNumber || found.rollNo || "";
      const email = found.email || "";
      const phone = found.phoneNumber || found.phone || "";
      const avatar =
        found.profilePicture || found.profileImage || found.image || "";
      const isSelf =
        (studentId && rawId === studentId) ||
        (studentRoll && roll && roll.toLowerCase() === studentRoll) ||
        (studentEmail && email && email.toLowerCase() === studentEmail);
      return { name: fullName, roll, email, phone, avatar, isSelf };
    }

    if (
      typeof raw === "string" &&
      raw.length > 2 &&
      !raw.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return {
        name: raw,
        roll: "",
        email: "",
        phone: "",
        avatar: "",
        isSelf: false,
      };
    }
    return {
      name: "Team Lead Assigned",
      roll: "",
      email: "",
      phone: "",
      avatar: "",
      isSelf: false,
    };
  };

  // Helper to resolve student member details
  const resolveMemberDetails = (m) => {
    if (!m)
      return {
        id: "",
        name: "Team Member",
        roll: "",
        email: "",
        phone: "",
        avatar: "",
        isSelf: false,
      };
    if (typeof m === "object" && m) {
      const fullName =
        `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
        m.name ||
        m.label ||
        m.email ||
        "Team Member";
      const roll = m.rollNumber || m.rollNo || "";
      const email = m.email || "";
      const phone = m.phoneNumber || m.phone || "";
      const avatar = m.profilePicture || m.profileImage || m.image || "";
      const mId = String(m._id || m.id || m.studentId || "");
      const isSelf =
        (studentId && mId === studentId) ||
        (studentRoll && roll && roll.toLowerCase() === studentRoll) ||
        (studentEmail && email && email.toLowerCase() === studentEmail);
      return { id: mId, name: fullName, roll, email, phone, avatar, isSelf };
    }

    const rawId = String(m);
    const found = students.find((s) => String(s._id || s.id) === rawId);
    if (found) {
      const fullName =
        `${found.firstName || ""} ${found.lastName || ""}`.trim() ||
        found.name ||
        found.email ||
        "Team Member";
      const roll = found.rollNumber || found.rollNo || "";
      const email = found.email || "";
      const phone = found.phoneNumber || found.phone || "";
      const avatar =
        found.profilePicture || found.profileImage || found.image || "";
      const isSelf =
        (studentId && rawId === studentId) ||
        (studentRoll && roll && roll.toLowerCase() === studentRoll) ||
        (studentEmail && email && email.toLowerCase() === studentEmail);
      return { id: rawId, name: fullName, roll, email, phone, avatar, isSelf };
    }

    if (typeof m === "string" && !m.match(/^[0-9a-fA-F]{24}$/)) {
      return {
        id: m,
        name: m,
        roll: "",
        email: "",
        phone: "",
        avatar: "",
        isSelf: false,
      };
    }
    return {
      id: rawId,
      name: "Team Member",
      roll: "",
      email: "",
      phone: "",
      avatar: "",
      isSelf: false,
    };
  };

  // Check if logged-in student is part of the given team
  const isStudentInTeam = (team) => {
    if (!studentId && !studentRoll && !studentEmail && !studentName)
      return false;

    // Check if team lead
    const rawLead = team.teamLead || team.lead || team.teamLeadId;
    const leadId = String(rawLead?._id || rawLead?.id || rawLead || "");
    const leadRoll = String(
      rawLead?.rollNumber || rawLead?.rollNo || "",
    ).toLowerCase();
    const leadEmail = String(rawLead?.email || "").toLowerCase();
    const leadName = String(
      rawLead?.firstName
        ? `${rawLead.firstName} ${rawLead.lastName || ""}`
        : rawLead?.name || rawLead || "",
    )
      .trim()
      .toLowerCase();

    if (studentId && leadId && leadId === studentId) return true;
    if (studentRoll && leadRoll && leadRoll === studentRoll) return true;
    if (studentEmail && leadEmail && leadEmail === studentEmail) return true;
    if (
      studentName &&
      leadName &&
      (leadName === studentName || leadName.includes(studentName))
    )
      return true;

    // Check if member
    if (Array.isArray(team.members)) {
      return team.members.some((m) => {
        const mId = String(m?._id || m?.id || m?.studentId || m || "");
        const mRoll = String(m?.rollNumber || m?.rollNo || "").toLowerCase();
        const mEmail = String(m?.email || "").toLowerCase();
        const mName = String(
          m?.firstName
            ? `${m.firstName} ${m.lastName || ""}`
            : m?.name || m || "",
        )
          .trim()
          .toLowerCase();

        return (
          (studentId && mId && mId === studentId) ||
          (studentRoll && mRoll && mRoll === studentRoll) ||
          (studentEmail && mEmail && mEmail === studentEmail) ||
          (studentName &&
            mName &&
            (mName === studentName || mName.includes(studentName)))
        );
      });
    }
    return false;
  };

  // Filter ONLY teams where the current student is assigned
  const myAssignedTeams = teams.filter(isStudentInTeam);

  // Selected team index if student is assigned to multiple teams
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const activeTeam =
    myAssignedTeams[activeTeamIndex] || myAssignedTeams[0] || null;

  // Resolve team batch name
  const getBatchName = (team) => {
    const rawBatch = team?.batchId || team?.batch;
    if (!rawBatch) return "Cohort 1";
    if (typeof rawBatch === "object")
      return rawBatch.batchName || rawBatch.name || "Cohort 1";
    const found = batches.find(
      (b) => String(b._id || b.id) === String(rawBatch),
    );
    return found ? found.batchName || found.name : "Cohort 1";
  };

  // Find all projects assigned to this specific team
  const getTeamProjects = (team) => {
    if (!team) return [];
    const tId = String(team._id || team.id || "");
    return projects.filter((project) => {
      const pTeamId =
        project.teamId?._id ||
        project.teamId?.id ||
        (typeof project.teamId === "string" ? project.teamId : null) ||
        project.team?._id ||
        project.team?.id ||
        (typeof project.team === "string" ? project.team : null);
      return pTeamId && String(pTeamId) === tId;
    });
  };

  const teamProjects = activeTeam ? getTeamProjects(activeTeam) : [];

  const formatDate = (date) => {
    if (!date) return "Not set";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Not set";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDuration = (startDate, deadline) => {
    if (!startDate || !deadline) return "Not set";
    const start = new Date(startDate);
    const end = new Date(deadline);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days >= 0 ? `${days} Days` : "Ongoing";
  };

  // ================= NO TEAM ASSIGNED VIEW =================
  if (!activeTeam) {
    return (
      <div className="p-5 max-w-5xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Student Portal</span>
            <span>›</span>
            <span className="font-semibold text-gray-800">My Team</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            My Project Team
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Assigned project team, leadership, teammates, and deliverable
            specifications
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <FiUsers size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            No Team Assigned Yet
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
            You are not currently enrolled in any project team. Once your
            instructor or batch administrator assigns you to a team, your team
            roster, assigned leader, and project details will appear here
            automatically.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-100">
            <FiInfo size={15} />
            Contact your mentor or batch administrator for team placement
          </div>
        </div>
      </div>
    );
  }

  // ================= FULL TEAM DETAILS VIEW =================
  const leadInfo = resolveStudentLead(activeTeam.teamLead || activeTeam.lead);
  const rawMembers = Array.isArray(activeTeam.members)
    ? activeTeam.members
    : typeof activeTeam.members === "string"
      ? activeTeam.members.split(",").map((m) => m.trim())
      : [];

  const memberDetailsList = rawMembers.map(resolveMemberDetails);
  const isUserLead = leadInfo.isSelf;
  const totalMemberCount =
    memberDetailsList.length + (leadInfo.name !== "Unassigned" ? 1 : 0);

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Student Portal</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">My Team</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <span>{activeTeam.teamName || activeTeam.name || "My Team"}</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                ● Your Assigned Team
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Complete details of your assigned project squad, team members, and
              active deliverables
            </p>
          </div>

          {/* Team Switcher if in multiple teams */}
          {myAssignedTeams.length > 1 && (
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200">
              {myAssignedTeams.map((t, idx) => (
                <button
                  key={t._id || t.id || idx}
                  type="button"
                  onClick={() => setActiveTeamIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeTeamIndex === idx
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.teamName || t.name || `Team ${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Team Banner / Overview Card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
              {(activeTeam.teamName || activeTeam.name || "T")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTeam.teamName || activeTeam.name || "Team Squad"}
                </h2>
                <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-semibold">
                  {getBatchName(activeTeam)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {activeTeam.description ||
                  "Official cohort project and collaboration group."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                Your Role
              </span>
              <p className="text-xs font-bold text-blue-700">
                {isUserLead ? "👑 Team Leader" : "👤 Team Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI Stat Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 bg-gray-50/50">
          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FiUsers size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase">
                Total Members
              </p>
              <p className="text-lg font-bold text-gray-900">
                {totalMemberCount}
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <FiFolder size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase">
                Assigned Projects
              </p>
              <p className="text-lg font-bold text-gray-900">
                {teamProjects.length}
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <FiCheckCircle size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase">
                Team Status
              </p>
              <p className="text-sm font-bold text-emerald-600">
                Active & Syncing
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <FiShield size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase">
                Leadership
              </p>
              <p className="text-xs font-bold text-gray-800 truncate max-w-28">
                {leadInfo.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Leader & Leadership Highlight */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiUserCheck className="text-blue-600" size={18} />
            Team Leader Profile
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
            Lead Coordinator
          </span>
        </div>

        <div className="bg-linear-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden border-2 border-white shadow-sm">
              {leadInfo.avatar ? (
                <img
                  src={leadInfo.avatar}
                  alt={leadInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                leadInfo.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 text-base">
                  {leadInfo.name}
                </h4>
                {leadInfo.isSelf && (
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    YOU
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-700 font-medium mt-0.5">
                Roll Number: {leadInfo.roll || "SMIT Lead"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 border-t sm:border-t-0 sm:border-l border-blue-200/60 pt-3 sm:pt-0 sm:pl-5">
            {leadInfo.email && (
              <div className="flex items-center gap-1.5">
                <FiMail className="text-blue-600" size={14} />
                <span>{leadInfo.email}</span>
              </div>
            )}
            {leadInfo.phone && (
              <div className="flex items-center gap-1.5">
                <FiPhone className="text-blue-600" size={14} />
                <span>{leadInfo.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Roster / All Members */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FiUsers className="text-blue-600" size={18} />
              Team Members Roster ({totalMemberCount})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              All peer students assigned to collaborate in this squad
            </p>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {memberDetailsList.length} Teammates + 1 Lead
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {/* Include Lead Card first */}
          {leadInfo.name !== "Unassigned" && (
            <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-300 shadow-2xs">
                  {leadInfo.avatar ? (
                    <img
                      src={leadInfo.avatar}
                      alt={leadInfo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    leadInfo.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 text-xs truncate">
                      {leadInfo.name}
                    </p>
                    {leadInfo.isSelf && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono">
                    {leadInfo.roll || "Lead"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
                LEAD
              </span>
            </div>
          )}

          {/* Member Cards */}
          {memberDetailsList.map((member, idx) => (
            <div
              key={member.id || idx}
              className={`border rounded-xl p-4 flex items-center justify-between transition ${
                member.isSelf
                  ? "bg-emerald-50/50 border-emerald-200 shadow-2xs"
                  : "bg-white border-gray-200 hover:border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-gray-200">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 text-xs truncate">
                      {member.name}
                    </p>
                    {member.isSelf && (
                      <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono truncate">
                    {member.roll || member.email || "Member"}
                  </p>
                </div>
              </div>

              <span className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded border border-gray-200">
                MEMBER
              </span>
            </div>
          ))}

          {memberDetailsList.length === 0 && leadInfo.name === "Unassigned" && (
            <div className="col-span-full py-8 text-center text-xs text-gray-400">
              No team members assigned yet.
            </div>
          )}
        </div>
      </div>

      {/* Assigned Project Full Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FiFolder className="text-blue-600" size={18} />
              Assigned Projects & Deliverables
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live milestones, project specifications, and deadlines
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">
            {teamProjects.length} Active{" "}
            {teamProjects.length === 1 ? "Project" : "Projects"}
          </span>
        </div>

        {teamProjects.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <FiFolder size={32} className="mx-auto text-gray-300" />
            <h4 className="font-bold text-gray-700 text-sm mt-2">
              No Project Assigned to this Team Yet
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Your instructor has not linked a capstone project to this team
              yet. Check back once sprints begin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {teamProjects.map((project) => {
              const pStatus = (project.status || "In Progress").trim();
              return (
                <div
                  key={project._id || project.id}
                  className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-gray-900">
                        {project.projectName ||
                          project.name ||
                          "Capstone Project"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {project.description ||
                          "Comprehensive bootcamp capstone project deliverables and team tasks."}
                      </p>
                    </div>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold w-fit ${
                        pStatus.toLowerCase() === "completed"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : pStatus.toLowerCase() === "in progress"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      ● {pStatus}
                    </span>
                  </div>

                  {/* Project Timeline Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <FiCalendar size={13} />
                        <span>Start Date</span>
                      </div>
                      <p className="font-bold text-gray-800 text-xs mt-1">
                        {formatDate(project.startDate)}
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-red-500 text-xs">
                        <FiCalendar size={13} />
                        <span>Deadline Date</span>
                      </div>
                      <p className="font-bold text-gray-800 text-xs mt-1">
                        {formatDate(project.deadline || project.endDate)}
                      </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-purple-600 text-xs">
                        <FiClock size={13} />
                        <span>Duration</span>
                      </div>
                      <p className="font-bold text-gray-800 text-xs mt-1">
                        {getDuration(
                          project.startDate,
                          project.deadline || project.endDate,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeam;
