import React, { createContext, useContext, useState, useEffect } from "react";

const RegistrationLogContext = createContext();

const STORAGE_KEY = "lms_registrations";

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

export const RegistrationLogProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialRegistrationData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
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

  return (
    <RegistrationLogContext.Provider
      value={{
        registrations,
        setRegistrations,
        addRegistrationLog,
      }}
    >
      {children}
    </RegistrationLogContext.Provider>
  );
};

export const useRegistrationLog = () => {
  const context = useContext(RegistrationLogContext);
  if (!context) {
    throw new Error(
      "useRegistrationLog must be used inside RegistrationLogProvider"
    );
  }
  return context;
};
