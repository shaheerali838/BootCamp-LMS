/**
 * Robust resource download helper for LMS.
 * Handles Cloudinary URLs, direct URLs, blobs, and fallback anchors.
 *
 * @param {string} fileUrl - The URL of the file to download
 * @param {string} fileName - Desired downloaded filename
 * @param {string} fileType - Optional format type (e.g. "PDF", "DOC", "ZIP")
 */
export const downloadResourceFile = async (fileUrl, fileName = "resource-file", fileType = "PDF") => {
  if (!fileUrl) {
    alert("No file attached to this resource.");
    return false;
  }

  // Sanitize and determine proper filename with extension
  let cleanName = (fileName || "resource-file").trim().replace(/[^a-zA-Z0-9._ -]/g, "_");
  const ext = (fileType || "PDF").toLowerCase().replace(/[^a-z0-9]/g, "");

  if (!cleanName.includes(".")) {
    cleanName = `${cleanName}.${ext === "vid" ? "mp4" : ext}`;
  }

  // Construct attachment URL for Cloudinary if applicable
  let downloadUrl = fileUrl;
  if (typeof fileUrl === "string" && fileUrl.includes("cloudinary.com") && fileUrl.includes("/upload/")) {
    // Avoid duplicate fl_attachment
    if (!fileUrl.includes("fl_attachment")) {
      downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
    }
  }

  try {
    // Method 1: Fetch as Blob for pure native download
    const response = await fetch(downloadUrl, { mode: "cors" });
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = blobUrl;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);
      return true;
    }
    throw new Error(`Fetch failed with status ${response.status}`);
  } catch (err) {
    console.warn("Direct blob download failed, trying anchor fallback:", err);

    // Method 2: Create download anchor with download attribute & target
    try {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = cleanName;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 300);
      return true;
    } catch (fallbackErr) {
      console.error("Fallback download failed, opening in new tab:", fallbackErr);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
      return true;
    }
  }
};

export default downloadResourceFile;
