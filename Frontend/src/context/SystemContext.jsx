import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const SystemContext = createContext();

// ── Static local data (no backend route) ──────────────────
const initialRegistrationData = [
  { id: 1, name: "Ali Hassan", role: "Student", email: "ali.hassan@smit.edu", date: "Aug 12, 2026", status: "Approved" },
  { id: 2, name: "Sara Bilal", role: "Super Admin", email: "superadmin@smit.edu.pk", date: "Aug 11, 2026", status: "Approved" },
  { id: 3, name: "Sir Usman", role: "Mentor", email: "usman@smit.edu.pk", date: "Aug 10, 2026", status: "Approved" },
];

const initialActivityData = [
  { id: 1, action: "New batch created (Batch 12 - Mobile App Dev)", actor: "Sara Bilal (SuperAdmin)", timestamp: "10 mins ago", type: "batch" },
  { id: 2, action: "New student registered (Ali Hassan)", actor: "Sir Ahmed", timestamp: "1 hour ago", type: "student" },
  { id: 3, action: "New project added (Hackathon Portal)", actor: "Sir Bilal", timestamp: "3 hours ago", type: "project" },
];

export const SystemProvider = ({ children }) => {
  const { accessToken, user } = useAuth();

  // ── Admins (API - SuperAdmin Only) ─────────────────────────
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState(null);

  // ── Mentors (API - Accessible to SuperAdmin and Admin) ─────
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [mentorsError, setMentorsError] = useState(null);

  const fetchAdmins = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    let rawUser = user;
    if (!rawUser) {
      try {
        rawUser = JSON.parse(localStorage.getItem("user"));
      } catch {
        rawUser = null;
      }
    }

    if (!token || !rawUser) return;

    // Only SUPER_ADMIN has authority to fetch full admin management records
    const normalizedRole = (rawUser.role || "")
      .toUpperCase()
      .replace(/[\s_]+/g, "");
    const isSuperAdmin = normalizedRole === "SUPERADMIN";
    if (!isSuperAdmin) {
      setAdmins([]);
      return;
    }

    setAdminsLoading(true);
    try {
      const res = await api.get("/admins/get-all-admins");
      setAdmins(res.data.data || []);
      setAdminsError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setAdmins([]);
        return;
      }
      console.error("Failed to fetch admins:", err);
      setAdminsError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setAdminsLoading(false);
    }
  }, [accessToken, user]);

  const fetchMentors = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    const rawUser = user || (() => {
      try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    })();

    if (!token) return;

    const role = (rawUser?.role || "").toUpperCase();
    if (role === "STUDENT") {
      setMentors([]);
      return;
    }

    setMentorsLoading(true);
    try {
      const res = await api.get("/admins/get-mentors");
      setMentors(res.data.data || []);
      setMentorsError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setMentors([]);
        return;
      }
      console.error("Failed to fetch mentors:", err);
      setMentorsError(err.response?.data?.message || "Failed to fetch mentors");
    } finally {
      setMentorsLoading(false);
    }
  }, [accessToken, user]);

  const addAdmin = async (newAdmin) => {
    setAdminsLoading(true);
    try {
      const payload = {
        firstName: newAdmin.firstName || newAdmin.name?.split(" ")[0] || "",
        lastName: newAdmin.lastName || newAdmin.name?.split(" ").slice(1).join(" ") || "",
        email: newAdmin.email,
        password: newAdmin.password,
        role: newAdmin.role || "admin",
        phoneNumber: newAdmin.phone || newAdmin.phoneNumber || "",
        status: newAdmin.status || "active",
      };
      const res = await api.post("/admins/create-admin", payload);
      // Invalidate & refetch authoritative admin & mentor lists
      await Promise.all([fetchAdmins(), fetchMentors()]);
      setAdminsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add admin:", err);
      setAdminsError(err.response?.data?.message || "Failed to create admin");
      throw err;
    } finally {
      setAdminsLoading(false);
    }
  };

  const updateAdmin = async (id, updatedData) => {
    setAdminsLoading(true);
    try {
      const payload = {
        firstName: updatedData.firstName || updatedData.name?.split(" ")[0],
        lastName: updatedData.lastName || updatedData.name?.split(" ").slice(1).join(" "),
        email: updatedData.email,
        role: updatedData.role,
        phoneNumber: updatedData.phone || updatedData.phoneNumber,
        status: updatedData.status,
      };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      const res = await api.put(`/admins/update-admin/${id}`, payload);
      // Invalidate & refetch authoritative admin & mentor lists
      await Promise.all([fetchAdmins(), fetchMentors()]);
      setAdminsError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update admin:", err);
      setAdminsError(err.response?.data?.message || "Failed to update admin");
      throw err;
    } finally {
      setAdminsLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    setAdminsLoading(true);
    try {
      await api.delete(`/admins/delete-admin/${id}`);
      // Invalidate & refetch authoritative admin & mentor lists
      await Promise.all([fetchAdmins(), fetchMentors()]);
      setAdminsError(null);
    } catch (err) {
      console.error("Failed to delete admin:", err);
      setAdminsError(err.response?.data?.message || "Failed to delete admin");
      throw err;
    } finally {
      setAdminsLoading(false);
    }
  };

  // ── Resources (API) ────────────────────────────────────────
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchResources = useCallback(async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return;

    setResourcesLoading(true);
    try {
      const [resRes, catRes] = await Promise.all([
        api.get("/resources/get-all-resources"),
        api.get("/resources/categories"),
      ]);
      setResources(resRes.data.data || []);
      setCategories(catRes.data.data || []);
      setResourcesError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setResources([]);
        setCategories([]);
        return;
      }
      console.error("Failed to fetch resources:", err);
      setResourcesError(err.response?.data?.message || "Failed to fetch resources");
    } finally {
      setResourcesLoading(false);
    }
  }, [accessToken]);

  const addResource = async (newResource) => {
    setResourcesLoading(true);
    try {
      let res;
      if (newResource instanceof FormData) {
        res = await api.post("/resources/create-resource", newResource, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const formData = new FormData();
        formData.append("title", newResource.title || newResource.name || "");
        formData.append("description", newResource.description || newResource.title || newResource.name || "");
        formData.append("fileType", newResource.fileType || newResource.type || "PDF");
        formData.append("category", newResource.categoryId || newResource.category || "");
        if (newResource.file) {
          formData.append("file", newResource.file);
        }
        res = await api.post("/resources/create-resource", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // Invalidate & refetch
      await fetchResources();
      setResourcesError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add resource:", err);
      const msg = err.response?.data?.message || err.message || "Failed to create resource";
      setResourcesError(msg);
      throw err;
    } finally {
      setResourcesLoading(false);
    }
  };

  const updateResource = async (id, updatedData) => {
    setResourcesLoading(true);
    try {
      let res;
      if (updatedData instanceof FormData) {
        res = await api.put(`/resources/update-resource/${id}`, updatedData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.put(`/resources/update-resource/${id}`, updatedData);
      }
      // Invalidate & refetch
      await fetchResources();
      setResourcesError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update resource:", err);
      const msg = err.response?.data?.message || err.message || "Failed to update resource";
      setResourcesError(msg);
      throw err;
    } finally {
      setResourcesLoading(false);
    }
  };

  const deleteResource = async (id) => {
    setResourcesLoading(true);
    try {
      await api.delete(`/resources/delete-resource/${id}`);
      // Invalidate & refetch
      await fetchResources();
      setResourcesError(null);
    } catch (err) {
      console.error("Failed to delete resource:", err);
      setResourcesError(err.response?.data?.message || "Failed to delete resource");
      throw err;
    } finally {
      setResourcesLoading(false);
    }
  };

  const addCategory = async (categoryName) => {
    try {
      const res = await api.post("/resources/categories/create", { categoryName });
      await fetchResources();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/resources/categories/${id}`);
      await fetchResources();
    } catch (err) {
      throw err;
    }
  };

  // ── Sync with Auth State ────────────────────────────────────
  useEffect(() => {
    if (accessToken) {
      fetchAdmins();
      fetchMentors();
      fetchResources();
    } else {
      setAdmins([]);
      setMentors([]);
      setResources([]);
      setCategories([]);
    }
  }, [accessToken, fetchAdmins, fetchMentors, fetchResources]);

  // ── Registration & Activity Log (local only) ───────────────
  const [registrations, setRegistrations] = useState(initialRegistrationData);
  const [activities, setActivities] = useState(initialActivityData);

  const addRegistrationLog = (log) => {
    setRegistrations((prev) => [{
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Approved",
      ...log,
    }, ...prev]);
  };

  const addActivityLog = (action, actor = "SuperAdmin", type = "system") => {
    setActivities((prev) => [{ id: Date.now(), action, actor, timestamp: "Just now", type }, ...prev]);
  };

  return (
    <SystemContext.Provider
      value={{
        // Admins (Full Management for SuperAdmin)
        admins, adminsLoading, adminsError,
        setAdmins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin,
        // Mentors (Eligible Mentors for SuperAdmin & Admin)
        mentors, mentorsLoading, mentorsError,
        setMentors, fetchMentors,
        // Resources
        resources, resourcesLoading, resourcesError, categories,
        setResources, fetchResources, addResource, updateResource, deleteResource,
        addCategory, deleteCategory,
        // Logs (local)
        registrations, setRegistrations, addRegistrationLog,
        activities, setActivities, addActivityLog,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used inside SystemProvider");
  return context;
};

// ── Thin compatibility wrappers ───────────────────────────
export const useAdmins = () => {
  const { admins, adminsLoading, adminsError, setAdmins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin, mentors, mentorsLoading, fetchMentors } = useSystem();
  return { admins, loading: adminsLoading, error: adminsError, setAdmins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin, mentors, mentorsLoading, fetchMentors };
};
export const useAdmin = useAdmins;

export const useMentors = () => {
  const { mentors, mentorsLoading, mentorsError, fetchMentors } = useSystem();
  return { mentors, loading: mentorsLoading, error: mentorsError, fetchMentors };
};
export const useMentor = useMentors;

export const useResources = () => {
  const { resources, resourcesLoading, resourcesError, categories, setResources, fetchResources, addResource, updateResource, deleteResource, addCategory, deleteCategory } = useSystem();
  return { resources, loading: resourcesLoading, error: resourcesError, categories, setResources, fetchResources, addResource, updateResource, deleteResource, addCategory, deleteCategory };
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
