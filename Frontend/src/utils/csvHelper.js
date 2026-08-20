/**
 * Utility to export tabular data to a formatted CSV file.
 * Handles Excel UTF-8 BOM, special character escaping, null values, and clean browser download.
 *
 * @param {string} filename - Target filename (e.g. 'attendance_2026-08-20.csv')
 * @param {Array<string>} headers - Column header titles
 * @param {Array<Array<any>>} rows - 2D Array of row cell values
 */
export const exportToCSV = (filename, headers = [], rows = []) => {
  if (!headers || !headers.length) {
    console.warn("exportToCSV: No headers provided.");
    return false;
  }

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(escapeCSV).join(",");
  const rowLines = (rows || []).map((row) =>
    (Array.isArray(row) ? row : []).map(escapeCSV).join(",")
  );

  // Prepend UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = "\uFEFF" + [headerLine, ...rowLines].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const safeFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.href = url;
  link.setAttribute("download", safeFilename);
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 300);

  return true;
};

export default exportToCSV;
