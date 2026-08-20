/**
 * Centralized Date & Time formatting helper utilities
 * Eliminates raw ISO string leaks (e.g., "2026-08-18T00:00:00.000Z")
 */

export const formatDate = (dateValue, fallback = "Not set") => {
  if (!dateValue) return fallback;
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue || fallback);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return fallback;
  }
};

export const formatDateTime = (dateValue, fallback = "Not set") => {
  if (!dateValue) return fallback;
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue || fallback);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return fallback;
  }
};

export const formatDateInput = (dateValue, fallback = "") => {
  if (!dateValue) return fallback;
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString().split("T")[0];
  } catch {
    return fallback;
  }
};

export const formatRelativeTime = (dateValue, fallback = "Recently") => {
  if (!dateValue) return fallback;
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return fallback;
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;
    return formatDate(d);
  } catch {
    return fallback;
  }
};

export default formatDate;
