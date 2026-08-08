import React from "react";
import {
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiCalendar,
    FiShare2,
    FiClipboard,
} from "react-icons/fi";
import StatCard from "./StatCard";

function StatsGrid({ stats }) {

    const data = stats || [
        {
            id: 1,
            label: "TOTAL STUDENTS",
            value: "245",
            icon: <FiUsers size={20} />,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            label: "PRESENT TODAY",
            value: "198/245",
            icon: <FiCheckCircle size={20} />,
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
            path: "/attendance",
        },
        {
            id: 3,
            label: "ABSENT TODAY",
            value: "28/245",
            icon: <FiXCircle size={20} />,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
        },
        {
            id: 4,
            label: "ON LEAVE",
            value: "19",
            icon: <FiCalendar size={20} />,
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500",
        },
        {
            id: 5,
            label: "TOTAL TEAMS",
            value: "12",
            icon: <FiShare2 size={20} />,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            id: 6,
            label: "PENDING TASKS",
            value: "34",
            icon: <FiClipboard size={20} />,
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((stat) => (
                <StatCard
                    key={stat.id}
                    icon={stat.icon}
                    iconBg={stat.iconBg}
                    iconColor={stat.iconColor}
                    value={stat.value}
                    label={stat.label}
                    path={stat.path}
                />
            ))}
        </div>
    );
}

export default StatsGrid;