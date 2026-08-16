
import React from "react";
import { useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  // Generate a readable title from the pathname
  const formatPath = (path) => {
    if (path === "/" || path.endsWith("/dashboard")) return "Dashboard";
    
    // Get the last segment of the path
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    
    const lastSegment = segments[segments.length - 1];
    
    // Convert kebab-case or snake_case to Title Case
    return lastSegment
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const currentPage = formatPath(location.pathname);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="text-sm text-gray-500">
        <span>Home</span>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">{currentPage}</span>
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{today}</p>
    </div>
  );
}

export default Breadcrumb;