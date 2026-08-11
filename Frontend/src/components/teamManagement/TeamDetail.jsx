import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { teamsData } from '../../data/team' // fixed path: actual file is src/data/team.js

function TeamDetails() {

  const navigate = useNavigate()
  const { id } = useParams()

  const teams = JSON.parse(
    localStorage.getItem('teams')
  ) || teamsData

  const team = teams.find(
    (item) => item.id.toString() === id
  )

  if (!team) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>

        <h1 className='text-2xl font-bold'>
          Team not found
        </h1>

        <button
          onClick={() => navigate('/teams')}
          className='mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg'
        >
          Back to Teams
        </button>

      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6 md:p-8'>

      <div className='mb-6'>

        <button
          onClick={() => navigate('/teams')}
          className='text-blue-600 hover:underline cursor-pointer'
        >
          ← Back to Teams
        </button>

      </div>

      <div className='bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8'>

        <div className='flex items-start justify-between'>

          <div>

            <h1 className='text-3xl font-bold text-[#111528]'>
              {team.name}
            </h1>

            <p className='text-gray-500 mt-1'>
              Lead: {team.lead}
            </p>

          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              team.status === 'Active'
                ? 'bg-green-100 text-green-600'
                : team.status === 'Completed'
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {team.status}
          </span>

        </div>

        <div className='flex flex-wrap gap-3 mt-5'>

          <span className='border border-blue-300 bg-white text-blue-600 px-4 py-1 rounded-full text-sm'>
            {team.project}
          </span>

          <span className='border border-blue-300 bg-white text-blue-600 px-4 py-1 rounded-full text-sm'>
            {team.members.length} members
          </span>

        </div>

        <div className='mt-5'>

          <div className='flex justify-between mb-2'>

            <span className='text-gray-600'>
              Project Progress
            </span>

            <span className='font-semibold'>
              {team.progress}%
            </span>

          </div>

          <div className='h-2 bg-blue-100 rounded-full overflow-hidden'>

            <div
              className='h-full bg-blue-600 rounded-full'
              style={{
                width: `${team.progress}%`
              }}
            ></div>

          </div>

        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>

          <div className='bg-white border border-blue-100 rounded-xl p-5 text-center'>

            <h2 className='text-2xl font-bold text-blue-600'>
              {team.members.length}
            </h2>

            <p className='text-gray-500 text-sm'>
              Members
            </p>

          </div>

          <div className='bg-white border border-blue-100 rounded-xl p-5 text-center'>

            <h2 className='text-2xl font-bold text-blue-600'>
              {team.tasks}
            </h2>

            <p className='text-gray-500 text-sm'>
              Tasks
            </p>

          </div>

          <div className='bg-white border border-blue-100 rounded-xl p-5 text-center'>

            <h2 className='text-2xl font-bold text-blue-600'>
              {team.progress}%
            </h2>

            <p className='text-gray-500 text-sm'>
              Completion
            </p>

          </div>

        </div>

      </div>

      <div className='bg-white border border-gray-200 rounded-2xl mt-6 p-6'>

        <h2 className='text-lg font-bold text-[#111528] mb-5'>
          Team Members
        </h2>

        <div className='space-y-5'>

          {team.members.map((member, index) => (

            <div
              key={index}
              className='flex items-center justify-between'
            >

              <div className='flex items-center gap-3'>

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ${
                    index === 0
                      ? 'bg-blue-600'
                      : index === 1
                      ? 'bg-purple-600'
                      : index === 2
                      ? 'bg-emerald-600'
                      : 'bg-orange-500'
                  }`}
                >
                  {member.name.charAt(0)}
                </div>

                <div>

                  <p className='text-sm font-medium text-[#111528]'>
                    {member.name}
                  </p>

                  <p className='text-xs text-gray-500'>
                    {member.role}
                  </p>

                </div>

              </div>

              <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs'>
                {member.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default TeamDetails