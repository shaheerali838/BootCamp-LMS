import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const AnnouncementContext = createContext(null);

export const AnnouncementProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── FETCH ──────────────────────────────────────────────────
  const fetchAnnouncements = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

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
  }, [accessToken]);

  // ── Sync with Auth State ────────────────────────────────────
  useEffect(() => {
    if (accessToken) {
      fetchAnnouncements();
    } else {
      setAnnouncements([]);
    }
  }, [accessToken, fetchAnnouncements]);

  // ── ADD ────────────────────────────────────────────────────
  const addAnnouncement = async (announcement) => {
    setLoading(true);
    try {
      const res = await api.post("/announcements/create-announcement", {
        title: announcement.title,
        description: announcement.description,
      });
      // Invalidate & refetch
      await fetchAnnouncements();
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
      // Invalidate & refetch
      await fetchAnnouncements();
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
      // Invalidate & refetch
      await fetchAnnouncements();
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
