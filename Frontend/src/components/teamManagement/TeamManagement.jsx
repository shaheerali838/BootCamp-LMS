import React, { useState } from 'react'
import TeamCard from './TeamCard'
import CreateTeam from './CreateTeam'
import { teamsData } from '../../data/team' // fixed path: actual file is src/data/team.js

function TeamManagement() {

    const [teams, setTeams] = useState(() => {

        const savedTeams = localStorage.getItem('teams')

        if (savedTeams) {
            return JSON.parse(savedTeams)
        }

        localStorage.setItem(
            'teams',
            JSON.stringify(teamsData)
        )

        return teamsData
    })

    const [showModal, setShowModal] = useState(false)

    const addTeam = (newTeam) => {

        const updatedTeams = [
            ...teams,
            newTeam
        ]

        setTeams(updatedTeams)

        localStorage.setItem(
            'teams',
            JSON.stringify(updatedTeams)
        )
    }

    return (
        <div className='min-h-screen bg-gray-50 p-6 md:p-8'>

            <div className='flex items-center justify-between mb-8'>

                <div>
                    <h1 className='text-3xl font-bold text-[#111528]'>
                        Team Management
                    </h1>

                    <p className='text-gray-500 mt-1'>
                        {teams.length} teams total
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className='bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer flex items-center gap-2'
                >
                    <span className='text-2xl leading-none'>
                        +
                    </span>

                    Create Team
                </button>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>

                {teams.map((team) => (

                    <TeamCard
                        key={team.id}
                        team={team}
                    />

                ))}

            </div>

            {showModal && (

                <CreateTeam
                    closeModal={() => setShowModal(false)}
                    addTeam={addTeam}
                />

            )}

        </div>
    )
}

export default TeamManagement