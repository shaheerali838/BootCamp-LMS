/**
 * Recursively trims all string properties in an object or array.
 * Preserves non-plain objects like Dates, Buffers, etc.
 */
const deepTrim = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepTrim(item));
  }

  if (
    typeof value === "object" &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(value instanceof Buffer)
  ) {
    const trimmedObj = {};
    for (const key of Object.keys(value)) {
      trimmedObj[key] = deepTrim(value[key]);
    }
    return trimmedObj;
  }

  return value;
};

/**
 * Express middleware to automatically trim all input fields in
 * req.body, req.query, and req.params before reaching routes/controllers.
 */
export const trimMiddleware = (req, res, next) => {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = deepTrim(req.body);
    }
    if (req.query && typeof req.query === "object") {
      req.query = deepTrim(req.query);
    }
    if (req.params && typeof req.params === "object") {
      req.params = deepTrim(req.params);
    }
  } catch (error) {
    console.error("Trim middleware error:", error);
  }
  next();
};

export default trimMiddleware;
