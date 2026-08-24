/**
 * Helper to dynamically determine the frontend client URL based on:
 * 1. Request Origin header (matches the hosted website domain like https://...vercel.app)
 * 2. Request Referer header
 * 3. Environment variables (CLIENT_URL, FRONTEND_URL, APP_URL)
 * 4. Local fallback (http://localhost:5173)
 */
export const getClientUrl = (req) => {
  // 1. Check Origin header from incoming HTTP request
  if (req) {
    const origin = req.get ? req.get("origin") : req.headers?.origin;
    if (
      origin &&
      typeof origin === "string" &&
      !origin.includes("undefined") &&
      !origin.includes("null")
    ) {
      return origin.trim().replace(/\/+$/, "");
    }

    // 2. Check Referer header from incoming HTTP request
    const referer = req.get ? req.get("referer") : req.headers?.referer;
    if (referer && typeof referer === "string") {
      try {
        const parsed = new URL(referer);
        if (
          parsed.origin &&
          !parsed.origin.includes("undefined") &&
          !parsed.origin.includes("null")
        ) {
          return parsed.origin.trim().replace(/\/+$/, "");
        }
      } catch (_) {
        // invalid URL format, ignore
      }
    }
  }

  // 3. Check environment variables
  const envUrl =
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    process.env.APP_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 4. Default fallback
  return "http://localhost:5173";
};
