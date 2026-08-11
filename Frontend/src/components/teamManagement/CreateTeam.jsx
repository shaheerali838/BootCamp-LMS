import React, { useState } from 'react'

function CreateTeam({ closeModal, addTeam }) {

  const [formData, setFormData] = useState({
    name: '',
    project: 'E-Commerce Platform',
    lead: 'Ahmed Hassan',
  })

  const [members, setMembers] = useState([])

  const availableMembers = [
    'Kamran Ali',
    'Sana Mirza',
    'Raza Khan',
    'Ayesha Noor',
    'Bilal Raza',
    'Hira Siddiqui',
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleMemberChange = (e) => {

    const member = e.target.value

    if (e.target.checked) {
      setMembers([
        ...members,
        member
      ])
    } else {
      setMembers(
        members.filter((item) => item !== member)
      )
    }
  }

  const submitForm = (e) => {

    e.preventDefault()

    const newMembers = [
      {
        name: formData.lead,
        role: 'Team Lead',
        status: 'Active',
      },
      ...members.map((member) => ({
        name: member,
        role: 'Member',
        status: 'Active',
      }))
    ]

    const newTeam = {
      id: Date.now(),
      name: formData.name,
      project: formData.project,
      lead: formData.lead,
      status: 'Active',
      members: newMembers,
      tasks: 0,
      progress: 0,
    }

    addTeam(newTeam)

    closeModal()
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>

      <div className='bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto'>

        <div className='flex items-center justify-between px-7 py-5 border-b border-gray-200'>

          <h2 className='text-2xl font-bold text-[#111528]'>
            Create New Team
          </h2>

          <button
            onClick={closeModal}
            className='text-3xl text-gray-500 hover:text-black cursor-pointer'
          >
            ×
          </button>

        </div>

        <form
          onSubmit={submitForm}
          className='px-7 py-6'
        >

          <div>

            <label className='block text-gray-700 text-lg font-medium mb-2'>
              Team Name
            </label>

            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='e.g. Team Eta'
              required
              className='border border-gray-200 w-full p-3 rounded-xl outline-none focus:border-blue-500'
            />

          </div>

          <div className='mt-6'>

            <label className='block text-gray-700 text-lg font-medium mb-2'>
              Assign Project
            </label>

            <select
              name='project'
              value={formData.project}
              onChange={handleChange}
              className='border border-gray-200 w-full p-3 rounded-xl outline-none focus:border-blue-500'
            >
              <option>E-Commerce Platform</option>
              <option>Hospital Management System</option>
              <option>LMS Portal</option>
              <option>Inventory Management</option>
              <option>AI Clinic System</option>
              <option>Chat Application</option>
            </select>

          </div>

          <div className='mt-6'>

            <label className='block text-gray-700 text-lg font-medium mb-2'>
              Team Lead
            </label>

            <select
              name='lead'
              value={formData.lead}
              onChange={handleChange}
              className='border border-gray-200 w-full p-3 rounded-xl outline-none focus:border-blue-500'
            >
              <option>Ahmed Hassan</option>
              <option>Fatima Khan</option>
              <option>Zain Ahmed</option>
              <option>Owais Khan</option>
              <option>Kashif Ahmed</option>
              <option>Waleed Khan</option>
            </select>

          </div>

          <div className='mt-6'>

            <label className='block text-gray-700 text-lg font-medium mb-2'>
              Add Members
            </label>

            <div className='border border-gray-200 rounded-xl p-4 max-h-48 overflow-y-auto'>

              {availableMembers.map((member) => (

                <label
                  key={member}
                  className='flex items-center gap-3 py-2 cursor-pointer'
                >

                  <input
                    type='checkbox'
                    value={member}
                    checked={members.includes(member)}
                    onChange={handleMemberChange}
                    className='w-4 h-4'
                  />

                  <span className='text-gray-700'>
                    {member}
                  </span>

                </label>

              ))}

            </div>

          </div>

          <div className='flex justify-end gap-3 mt-7'>

            <button
              type='button'
              onClick={closeModal}
              className='border border-gray-200 px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'
            >
              Cancel
            </button>

            <button
              type='submit'
              className='bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 cursor-pointer'
            >
              Create Team
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateTeam