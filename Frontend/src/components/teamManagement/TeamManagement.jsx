import React, { useState } from "react";
import CreateTeam from "./CreateTeam";
import TeamCard from "./TeamCard";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function TeamManagement() {
  const { teams } = useTeamProject();

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Team Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create and manage your teams.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0476b9] text-white px-5 py-2.5 rounded-lg hover:bg-[#03669f]"
        >
          + Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Teams Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first team to get started.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-5 bg-[#0476b9] text-white px-5 py-2 rounded-lg"
          >
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateTeam
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default TeamManagement;