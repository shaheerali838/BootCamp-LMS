
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
    <div className="min-w-0">
      <div className="flex items-center text-xs sm:text-sm text-gray-500 font-medium truncate">
        <span className="hidden xs:inline">Home</span>
        <span className="mx-1 hidden xs:inline text-gray-300">/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
          {currentPage}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block truncate">
        {today}
      </p>
    </div>
  );
}

export default Breadcrumb;