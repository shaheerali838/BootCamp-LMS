import React from 'react';
import { useAuth } from '../../../context/AuthContext';

function WelcomeHeader({ name }) {
    const { user } = useAuth();
    const displayName = name || (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Admin" : "Admin");

    return (
        <div className="mb-2 p-2">
            <h1 className="text-2xl font-bold text-gray-900 pt-3 flex items-center gap-2">
                Welcome back, {displayName}
                <span>👋</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
                Here's what's happening at SMIT today.
            </p>
        </div>
    );
}

export default WelcomeHeader;
