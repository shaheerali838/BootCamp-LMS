import React, { createContext, useContext, useState, useEffect } from "react";

const ResourceContext = createContext();

const STORAGE_KEY = "lms_resources";

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

export const ResourceProvider = ({ children }) => {
  const [resources, setResources] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialResourceData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  }, [resources]);

  const addResource = (newResource) => {
    setResources((prev) => [...prev, { ...newResource, id: Date.now() }]);
  };

  const updateResource = (id, updatedData) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  return (
    <ResourceContext.Provider
      value={{
        resources,
        setResources,
        addResource,
        updateResource,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResources must be used inside ResourceProvider");
  }
  return context;
};

export const useResource = useResources;
