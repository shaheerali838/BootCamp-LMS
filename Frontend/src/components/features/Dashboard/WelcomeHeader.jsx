import React from 'react'

function WelcomeHeader({ name = "Admin" }) {
    return (
        <div className="mb-2 p-2">
            <h1 className="text-2xl font-bold text-gray-900 pt-5 gap-2">
                Welcome back, {name}
                <span >👋</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
                Here's what's happening at SMIT today.
            </p>
        </div>
    );
}

export default WelcomeHeader
