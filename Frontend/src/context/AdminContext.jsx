import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

const STORAGE_KEY = "lms_admins";

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

export const AdminProvider = ({ children }) => {
  const [admins, setAdmins] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialAdminData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
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

  return (
    <AdminContext.Provider
      value={{
        admins,
        setAdmins,
        addAdmin,
        updateAdmin,
        deleteAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmins = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmins must be used inside AdminProvider");
  }
  return context;
};

export const useAdmin = useAdmins;
