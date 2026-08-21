import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [actionMessage, setActionMessage] = useState("");
  const [isManualLoading, setIsManualLoading] = useState(false);

  const startLoading = useCallback((message = "Loading...") => {
    setActionMessage(message);
    setIsManualLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsManualLoading(false);
    setActionMessage("");
  }, []);

  const withLoading = useCallback(async (asyncFn, message = "Processing...") => {
    startLoading(message);
    try {
      return await asyncFn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Set up global Axios interceptors
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        // Skip background silent polling if marked
        if (!config.silent) {
          setActiveRequests((prev) => prev + 1);
          // Set appropriate action message based on HTTP method
          const method = (config.method || "get").toUpperCase();
          if (method === "POST") setActionMessage("Saving data...");
          else if (method === "PUT" || method === "PATCH") setActionMessage("Updating data...");
          else if (method === "DELETE") setActionMessage("Deleting item...");
          else if (method === "GET") setActionMessage("Refreshing components...");
        }
        return config;
      },
      (error) => {
        setActiveRequests((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    const resInterceptor = api.interceptors.response.use(
      (response) => {
        if (!response.config?.silent) {
          setActiveRequests((prev) => {
            const next = Math.max(0, prev - 1);
            if (next === 0 && !isManualLoading) {
              setActionMessage("");
            }
            return next;
          });
        }
        return response;
      },
      (error) => {
        if (!error.config?.silent) {
          setActiveRequests((prev) => {
            const next = Math.max(0, prev - 1);
            if (next === 0 && !isManualLoading) {
              setActionMessage("");
            }
            return next;
          });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [isManualLoading]);

  const isLoading = activeRequests > 0 || isManualLoading;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        activeRequests,
        actionMessage: actionMessage || (isLoading ? "Syncing data..." : ""),
        startLoading,
        stopLoading,
        withLoading,
      }}
    >
      {/* Top Progress Loading Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-9999 h-1 bg-transparent overflow-hidden pointer-events-none">
          <div className="h-full w-full bg-linear-to-r from-blue-500 via-[#0476b9] to-indigo-600 animate-top-progress" />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
