import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AnnouncementContext = createContext(null);

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── FETCH ──────────────────────────────────────────────────
  const fetchAnnouncements = async () => {
    const token = localStorage.getItem("accessToken");
    const isAuth =
      typeof window !== "undefined" &&
      (window.location.pathname === "/login" ||
        window.location.pathname.startsWith("/auth") ||
        window.location.pathname === "/forgot-password");
    if (!token || isAuth) return;

    setLoading(true);
    try {
      const res = await api.get("/announcements/get-all-announcements");
      setAnnouncements(res.data.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setAnnouncements([]);
        return;
      }
      console.error("Failed to fetch announcements:", err);
      setError(err.response?.data?.message || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ── ADD ────────────────────────────────────────────────────
  const addAnnouncement = async (announcement) => {
    setLoading(true);
    try {
      const res = await api.post("/announcements/create-announcement", {
        title: announcement.title,
        description: announcement.description,
      });
      if (res.data.success) {
        setAnnouncements((prev) => [res.data.data, ...prev]);
      }
      setError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add announcement:", err);
      setError(err.response?.data?.message || "Failed to create announcement");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── UPDATE ─────────────────────────────────────────────────
  const updateAnnouncement = async (id, updatedData) => {
    setLoading(true);
    try {
      const res = await api.put(
        `/announcements/update-announcement/${id}`,
        updatedData,
      );
      if (res.data.success) {
        setAnnouncements((prev) =>
          prev.map((a) => (a._id === id ? res.data.data : a)),
        );
      }
      setError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update announcement:", err);
      setError(err.response?.data?.message || "Failed to update announcement");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────
  const deleteAnnouncement = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/announcements/delete-announcement/${id}`);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      setError(null);
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      setError(err.response?.data?.message || "Failed to delete announcement");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        loading,
        error,
        fetchAnnouncements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncement = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error("useAnnouncement must be used inside AnnouncementProvider");
  }
  return context;
};
