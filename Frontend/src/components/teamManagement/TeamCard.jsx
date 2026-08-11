import React from 'react'
import { useNavigate } from 'react-router-dom'

function TeamCard({ team }) {
    const navigate = useNavigate()

    const getInitial = (name) => {
        return name.charAt(0).toUpperCase()
    }

    return (
        <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-7 hover:shadow-md transition'>

            <div className='flex items-start justify-between gap-3'>

                <div>
                    <h2 className='text-2xl font-bold text-[#111528]'>
                        {team.name}
                    </h2>

                    <p className='text-gray-500 mt-1'>
                        {team.project}
                    </p>
                </div>

                <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${team.status === 'Active'
                            ? 'bg-green-100 text-green-600'
                            : team.status === 'Completed'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600'
                        }`}
                >
                    {team.status}
                </span>

            </div>

            <div className='flex items-center mt-5'>

                {team.members.slice(0, 4).map((member, index) => (
                    <div
                        key={index}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white -ml-1 ${index === 0
                                ? 'bg-cyan-600'
                                : index === 1
                                    ? 'bg-blue-600'
                                    : index === 2
                                        ? 'bg-purple-600'
                                        : 'bg-indigo-600'
                            }`}
                    >
                        {getInitial(member.name)}
                    </div>
                ))}

            </div>

            <p className='text-gray-500 mt-3'>
                {team.members.length} members
            </p>

            <div className='mt-5'>

                <div className='flex items-center justify-between mb-2'>
                    <span className='text-gray-500'>
                        Progress
                    </span>

                    <span className='font-semibold text-[#111528]'>
                        {team.progress}%
                    </span>
                </div>

                <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>

                    <div
                        className='h-full bg-blue-600 rounded-full'
                        style={{ width: `${team.progress}%` }}
                    ></div>

                </div>

            </div>

            <button
                onClick={() => navigate(`/teams/${team.id}`)}
                className='mt-6 w-full border border-gray-200 rounded-xl py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer'
            >
                View Details
            </button>

        </div>
    )
}

export default TeamCard