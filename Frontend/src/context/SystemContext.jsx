import React, { createContext, useContext, useState, useEffect } from "react";

const SystemContext = createContext();

const ADMIN_STORAGE_KEY = "lms_admins";
const RESOURCE_STORAGE_KEY = "lms_resources";
const REGISTRATION_STORAGE_KEY = "lms_registrations";
const ACTIVITY_STORAGE_KEY = "lms_activity";

const initialAdminData = [
  {
    id: 1,
    name: "Sara Bilal (SuperAdmin)",
    email: "superadmin@smit.edu.pk",
    role: "Super Admin",
    status: "Active",
    phone: "0300-9999999",
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "Sir Ahmed",
    email: "ahmed@smit.edu.pk",
    role: "Admin",
    status: "Active",
    phone: "0300-8888111",
    createdAt: "2026-02-15",
  },
  {
    id: 3,
    name: "Sir Bilal",
    email: "bilal@smit.edu.pk",
    role: "Mentor",
    status: "Active",
    phone: "0300-8888222",
    createdAt: "2026-03-01",
  },
  {
    id: 4,
    name: "Sir Usman",
    email: "usman@smit.edu.pk",
    role: "Mentor",
    status: "Active",
    phone: "0300-8888333",
    createdAt: "2026-03-12",
  },
  {
    id: 5,
    name: "Miss Ayesha",
    email: "ayesha.mentor@smit.edu.pk",
    role: "Mentor",
    status: "Active",
    phone: "0300-8888444",
    createdAt: "2026-04-05",
  },
];

const initialResourceData = [
  {
    id: 1,
    name: "React Advanced Patterns.pdf",
    size: "4.2 MB",
    date: "Aug 5, 2025",
    category: "React",
    type: "PDF",
  },
  {
    id: 2,
    name: "Node.js Best Practices Guide.pdf",
    size: "2.8 MB",
    date: "Aug 5, 2025",
    category: "Node.js",
    type: "PDF",
  },
  {
    id: 3,
    name: "Database Normalization Lecture.mp4",
    size: "214 MB",
    date: "Aug 3, 2025",
    category: "Database",
    type: "VID",
  },
  {
    id: 4,
    name: "JavaScript ES2024 Features.pdf",
    size: "1.5 MB",
    date: "Jul 30, 2025",
    category: "JavaScript",
    type: "PDF",
  },
  {
    id: 5,
    name: "Batch 7 Project Templates.zip",
    size: "8.1 MB",
    date: "Jul 28, 2025",
    category: "Projects",
    type: "ZIP",
  },
  {
    id: 6,
    name: "Mid-term Assessment Syllabus.docx",
    size: "0.3 MB",
    date: "Jul 25, 2025",
    category: "Academic",
    type: "DOC",
  },
  {
    id: 7,
    name: "CSS Grid & Flexbox Masterclass.mp4",
    size: "180 MB",
    date: "Jul 22, 2025",
    category: "CSS",
    type: "VID",
  },
  {
    id: 8,
    name: "Week 8 Lecture Slides.pptx",
    size: "5.6 MB",
    date: "Jul 20, 2025",
    category: "Lectures",
    type: "PPT",
  },
];

const initialRegistrationData = [
  {
    id: 1,
    name: "Ali Hassan",
    role: "Student",
    email: "ali.hassan@smit.edu",
    date: "Aug 12, 2026",
    status: "Approved",
  },
  {
    id: 2,
    name: "Sara Bilal",
    role: "Super Admin",
    email: "superadmin@smit.edu.pk",
    date: "Aug 11, 2026",
    status: "Approved",
  },
  {
    id: 3,
    name: "Sir Usman",
    role: "Mentor",
    email: "usman@smit.edu.pk",
    date: "Aug 10, 2026",
    status: "Approved",
  },
  {
    id: 4,
    name: "Maria Khan",
    role: "Student",
    email: "maria.khan@smit.edu",
    date: "Aug 09, 2026",
    status: "Approved",
  },
  {
    id: 5,
    name: "Sir Bilal",
    role: "Admin",
    email: "bilal@smit.edu.pk",
    date: "Aug 08, 2026",
    status: "Approved",
  },
];

const initialActivityData = [
  {
    id: 1,
    action: "New batch created (Batch 12 - Mobile App Dev)",
    actor: "Sara Bilal (SuperAdmin)",
    timestamp: "10 mins ago",
    type: "batch",
  },
  {
    id: 2,
    action: "New student registered (Ali Hassan)",
    actor: "Sir Ahmed",
    timestamp: "1 hour ago",
    type: "student",
  },
  {
    id: 3,
    action: "New project added (Hackathon Portal)",
    actor: "Sir Bilal",
    timestamp: "3 hours ago",
    type: "project",
  },
  {
    id: 4,
    action: "Attendance report generated for Batch 11",
    actor: "System",
    timestamp: "5 hours ago",
    type: "attendance",
  },
  {
    id: 5,
    action: "Milestone status updated to Completed",
    actor: "Sir Usman",
    timestamp: "Yesterday",
    type: "milestone",
  },
];

export const SystemProvider = ({ children }) => {
  // --- Admin State ---
  const [admins, setAdmins] = useState(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialAdminData;
  });

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins));
  }, [admins]);

  const addAdmin = (newAdmin) => {
    setAdmins((prev) => [
      ...prev,
      {
        ...newAdmin,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const updateAdmin = (id, updatedData) => {
    setAdmins((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteAdmin = (id) => {
    setAdmins((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Resource State ---
  const [resources, setResources] = useState(() => {
    const stored = localStorage.getItem(RESOURCE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialResourceData;
  });

  useEffect(() => {
    localStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(resources));
  }, [resources]);

  const addResource = (newResource) => {
    setResources((prev) => [...prev, { ...newResource, id: Date.now() }]);
  };

  const updateResource = (id, updatedData) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  // --- Registration Log State ---
  const [registrations, setRegistrations] = useState(() => {
    const stored = localStorage.getItem(REGISTRATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialRegistrationData;
  });

  useEffect(() => {
    localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(registrations));
  }, [registrations]);

  const addRegistrationLog = (log) => {
    setRegistrations((prev) => [
      {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        status: "Approved",
        ...log,
      },
      ...prev,
    ]);
  };

  // --- Activity Log State ---
  const [activities, setActivities] = useState(() => {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialActivityData;
  });

  useEffect(() => {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivityLog = (action, actor = "SuperAdmin", type = "system") => {
    setActivities((prev) => [
      {
        id: Date.now(),
        action,
        actor,
        timestamp: "Just now",
        type,
      },
      ...prev,
    ]);
  };

  return (
    <SystemContext.Provider
      value={{
        // Admin slice
        admins,
        setAdmins,
        addAdmin,
        updateAdmin,
        deleteAdmin,
        // Resource slice
        resources,
        setResources,
        addResource,
        updateResource,
        // Registration Log slice
        registrations,
        setRegistrations,
        addRegistrationLog,
        // Activity Log slice
        activities,
        setActivities,
        addActivityLog,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used inside SystemProvider");
  }
  return context;
};

// Thin exported compatibility wrappers
export const useAdmins = () => {
  const { admins, setAdmins, addAdmin, updateAdmin, deleteAdmin } = useSystem();
  return { admins, setAdmins, addAdmin, updateAdmin, deleteAdmin };
};

export const useAdmin = useAdmins;

export const useResources = () => {
  const { resources, setResources, addResource, updateResource } = useSystem();
  return { resources, setResources, addResource, updateResource };
};

export const useResource = useResources;

export const useRegistrationLog = () => {
  const { registrations, setRegistrations, addRegistrationLog } = useSystem();
  return { registrations, setRegistrations, addRegistrationLog };
};

export const useActivityLog = () => {
  const { activities, setActivities, addActivityLog } = useSystem();
  return { activities, setActivities, addActivityLog };
};
