import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const SystemContext = createContext();

// ── Static local data (no backend route) ──────────────────
const initialResourceData = [
  { id: 1, name: "React Advanced Patterns.pdf", size: "4.2 MB", date: "Aug 5, 2025", category: "React", type: "PDF" },
  { id: 2, name: "Node.js Best Practices Guide.pdf", size: "2.8 MB", date: "Aug 5, 2025", category: "Node.js", type: "PDF" },
  { id: 3, name: "Database Normalization Lecture.mp4", size: "214 MB", date: "Aug 3, 2025", category: "Database", type: "VID" },
  { id: 4, name: "JavaScript ES2024 Features.pdf", size: "1.5 MB", date: "Jul 30, 2025", category: "JavaScript", type: "PDF" },
];

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
  // ── Admins (API) ───────────────────────────────────────────
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState(null);

  const fetchAdmins = async () => {
    const token = localStorage.getItem("accessToken");
    const rawUser = localStorage.getItem("user");
    const isAuth = typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname.startsWith("/auth") || window.location.pathname === "/forgot-password");
    if (!token || isAuth) return;

    // Only SUPER_ADMIN has authority to fetch admin records
    let userObj = null;
    try { userObj = JSON.parse(rawUser); } catch {}
    const role = (userObj?.role || "").toUpperCase();
    const isSuperAdmin = role === "SUPER_ADMIN" || role === "SUPERADMIN" || role === "SUPER ADMIN";
    if (!isSuperAdmin) return;

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
  };

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
      if (res.data.success) setAdmins((prev) => [res.data.data, ...prev]);
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
      if (res.data.success) {
        setAdmins((prev) => prev.map((a) => (a._id === id ? res.data.data : a)));
      }
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
      setAdmins((prev) => prev.filter((a) => a._id !== id));
      setAdminsError(null);
    } catch (err) {
      console.error("Failed to delete admin:", err);
      setAdminsError(err.response?.data?.message || "Failed to delete admin");
      throw err;
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ── Resources (API) ────────────────────────────────────────
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchResources = async () => {
    const token = localStorage.getItem("accessToken");
    const isAuth = typeof window !== "undefined" && (window.location.pathname === "/login" || window.location.pathname.startsWith("/auth") || window.location.pathname === "/forgot-password");
    if (!token || isAuth) return;

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
  };

  const addResource = async (newResource) => {
    setResourcesLoading(true);
    try {
      const res = await api.post("/resources/create-resource", {
        title: newResource.title || newResource.name,
        description: newResource.description || newResource.name,
        file: newResource.file || newResource.url || "",
        fileType: newResource.fileType || newResource.type || "PDF",
        category: newResource.categoryId || newResource.category,
      });
      if (res.data.success) setResources((prev) => [res.data.data, ...prev]);
      setResourcesError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to add resource:", err);
      setResourcesError(err.response?.data?.message || "Failed to create resource");
      throw err;
    } finally {
      setResourcesLoading(false);
    }
  };

  const updateResource = async (id, updatedData) => {
    setResourcesLoading(true);
    try {
      const res = await api.put(`/resources/update-resource/${id}`, updatedData);
      if (res.data.success) {
        setResources((prev) => prev.map((r) => (r._id === id ? res.data.data : r)));
      }
      setResourcesError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to update resource:", err);
      setResourcesError(err.response?.data?.message || "Failed to update resource");
      throw err;
    } finally {
      setResourcesLoading(false);
    }
  };

  const deleteResource = async (id) => {
    setResourcesLoading(true);
    try {
      await api.delete(`/resources/delete-resource/${id}`);
      setResources((prev) => prev.filter((r) => r._id !== id));
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
      if (res.data.success) setCategories((prev) => [...prev, res.data.data]);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/resources/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchResources();
  }, []);

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
        // Admins
        admins, adminsLoading, adminsError,
        setAdmins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin,
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
  const { admins, adminsLoading, adminsError, setAdmins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin } = useSystem();
  return { admins, loading: adminsLoading, error: adminsError, setAdmins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin };
};
export const useAdmin = useAdmins;

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
