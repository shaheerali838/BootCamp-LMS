import React, { useState } from "react";
import { useTeamProject } from "../../contextAPI/TeamProjectContext";

function CreateTeam({ closeModal, initialData = null }) {
  const { addTeam, updateTeam } = useTeamProject();

  const [formData, setFormData] = useState({
    name: "",
    lead: "",
    description: "",
    members: [],
  });

  const [memberName, setMemberName] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addMember = () => {
    if (!memberName.trim()) return;

    setFormData({
      ...formData,
      members: [
        ...formData.members,
        {
          id: Date.now(),
          name: memberName,
        },
      ],
    });

    setMemberName("");
  };

  // Populate form when editing
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        lead: initialData.lead || "",
        description: initialData.description || "",
        members: initialData.members || [],
      });
    }
  }, [initialData]);

  const removeMember = (memberId) => {
    setFormData({
      ...formData,
      members: formData.members.filter(
        (member) => member.id !== memberId
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    if (initialData) {
      // Editing existing team
      updateTeam(initialData.id, formData);
    } else {
      addTeam(formData);
    }

    setFormData({
      name: "",
      lead: "",
      description: "",
      members: [],
    });

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Edit Team" : "Create Team"}
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-700">
            Team Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter team name"
            className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 mb-4 outline-none focus:border-[#0476b9]"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Team Lead
          </label>

          <input
            type="text"
            name="lead"
            value={formData.lead}
            onChange={handleChange}
            placeholder="Enter team lead"
            className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 mb-4 outline-none focus:border-[#0476b9]"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter team description"
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 mb-4 outline-none focus:border-[#0476b9]"
          />

          <label className="block text-sm font-semibold text-gray-700">
            Add Members
          </label>

          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Member name"
              className="flex-1 border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#0476b9]"
            />

            <button
              type="button"
              onClick={addMember}
              className="bg-[#0476b9] text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {formData.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
              >
                <span>{member.name}</span>

                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 border border-gray-300 py-2.5 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#0476b9] text-white py-2.5 rounded-lg hover:bg-[#03669f]"
            >
              {initialData ? "Save Changes" : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTeam;