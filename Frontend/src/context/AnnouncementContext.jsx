import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AnnouncementContext = createContext(null);

const getSavedAnnouncements = () => {
  try {
    const saved = localStorage.getItem("announcements");

    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error(
      "Failed to load announcements:",
      error
    );

    return [];
  }
};

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] =
    useState(getSavedAnnouncements);

  // --------------------------------
  // SAVE TO LOCAL STORAGE
  // --------------------------------

  useEffect(() => {
    localStorage.setItem(
      "announcements",
      JSON.stringify(announcements)
    );
  }, [announcements]);

  // --------------------------------
  // ADD ANNOUNCEMENT
  // --------------------------------

  const addAnnouncement = (announcement) => {
    const newAnnouncement = {
      id: Date.now(),
      title: announcement.title,
      description: announcement.description,
      createdAt: new Date().toLocaleDateString(),
    };

    setAnnouncements((prev) => [
      newAnnouncement,
      ...prev,
    ]);
  };

  // --------------------------------
  // UPDATE ANNOUNCEMENT
  // --------------------------------

  const updateAnnouncement = (
    id,
    updatedData
  ) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id
          ? {
              ...announcement,
              ...updatedData,
            }
          : announcement
      )
    );
  };

  // --------------------------------
  // DELETE ANNOUNCEMENT
  // --------------------------------

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.filter(
        (announcement) =>
          announcement.id !== id
      )
    );
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

// --------------------------------
// CUSTOM HOOK
// --------------------------------

export const useAnnouncement = () => {
  const context = useContext(
    AnnouncementContext
  );

  if (!context) {
    throw new Error(
      "useAnnouncement must be used inside AnnouncementProvider"
    );
  }

  return context;
};