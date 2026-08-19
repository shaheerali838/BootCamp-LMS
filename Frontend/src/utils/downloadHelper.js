/**
 * Opens and views/downloads resource document directly in a new tab.
 * Routes through the server's authenticated Cloudinary streaming proxy for 100% reliable document delivery.
 *
 * @param {string|Object} resourceOrUrl - Resource object or direct URL string
 */
export const downloadResourceFile = (resourceOrUrl) => {
  if (!resourceOrUrl) {
    alert("No file attached to this resource.");
    return false;
  }

  let resourceId = null;
  let fileUrl = "";

  if (typeof resourceOrUrl === "object" && resourceOrUrl !== null) {
    resourceId = resourceOrUrl._id || resourceOrUrl.id || null;
    fileUrl =
      resourceOrUrl.file ||
      resourceOrUrl.fileUrl ||
      resourceOrUrl.url ||
      resourceOrUrl.link ||
      "";
  } else if (typeof resourceOrUrl === "string") {
    fileUrl = resourceOrUrl;
  }

  const backendHost = (import.meta.env.VITE_API_URL || "http://localhost:7000")
    .trim()
    .replace(/\/api\/?$/, "");

  let openUrl = "";

  // 1. Primary: Use the backend stream proxy which generates signed Cloudinary delivery
  if (resourceId) {
    openUrl = `${backendHost}/api/resources/download/${resourceId}`;
  } else if (fileUrl) {
    let targetUrl = fileUrl.trim();
    if (targetUrl.startsWith("/")) {
      targetUrl = `${backendHost}${targetUrl}`;
    }
    openUrl = targetUrl;
  }

  if (!openUrl) {
    alert("No file available for this resource.");
    return false;
  }

  // Open the file directly in a new tab
  const opened = window.open(openUrl, "_blank", "noopener,noreferrer");
  if (!opened) {
    // If popup blocker intervened, trigger click via invisible anchor tag
    const link = document.createElement("a");
    link.href = openUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 300);
  }

  return true;
};

export default downloadResourceFile;
