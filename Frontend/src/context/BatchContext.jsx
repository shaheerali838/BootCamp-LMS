import React, { createContext, useContext, useState, useEffect } from "react";

const BatchContext = createContext();

const STORAGE_KEY = "lms_batches";

const initialBatchData = [
  {
    id: 1,
    name: "Batch 11 - Web Development",
    code: "B11-WEB",
    status: "Active",
    studentCount: 42,
    startDate: "2026-01-15",
    endDate: "2026-07-15",
  },
  {
    id: 2,
    name: "Batch 10 - Web Development",
    code: "B10-WEB",
    status: "Active",
    studentCount: 38,
    startDate: "2025-08-01",
    endDate: "2026-02-01",
  },
  {
    id: 3,
    name: "Batch 12 - Mobile App Dev",
    code: "B12-MOB",
    status: "Active",
    studentCount: 30,
    startDate: "2026-03-01",
    endDate: "2026-09-01",
  },
  {
    id: 4,
    name: "Batch 9 - Python AI & ML",
    code: "B9-AIML",
    status: "Completed",
    studentCount: 50,
    startDate: "2025-02-01",
    endDate: "2025-08-01",
  },
];

export const BatchProvider = ({ children }) => {
  const [batches, setBatches] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialBatchData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
  }, [batches]);

  const addBatch = (newBatch) => {
    setBatches((prev) => [
      ...prev,
      {
        ...newBatch,
        id: Date.now(),
        studentCount: newBatch.studentCount || 0,
        status: newBatch.status || "Active",
      },
    ]);
  };

  const updateBatch = (id, updatedData) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
    );
  };

  const deleteBatch = (id) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BatchContext.Provider
      value={{
        batches,
        setBatches,
        addBatch,
        updateBatch,
        deleteBatch,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatches = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error("useBatches must be used inside BatchProvider");
  }
  return context;
};

export const useBatch = useBatches;
