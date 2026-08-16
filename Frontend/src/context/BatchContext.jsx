import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const BatchContext = createContext();

export const BatchProvider = ({ children }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch batches from backend
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/batches/get-all-batches");
      if (response.data.success) {
        setBatches(response.data.batches);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch batches:", err);
      setError(err.response?.data?.message || "Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const addBatch = async (newBatch) => {
    setLoading(true);
    try {
      // Map frontend naming to backend schema if needed
      const payload = {
        batchName: newBatch.batchName || newBatch.name,
        program: newBatch.program || newBatch.code,
        startDate: newBatch.startDate,
        endDate: newBatch.endDate,
        status: newBatch.status || "active",
      };

      const response = await api.post("/batches/create-batch", payload);
      if (response.data.success) {
        setBatches((prev) => [response.data.batch, ...prev]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to add batch:", err);
      setError(err.response?.data?.message || "Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  const updateBatch = async (id, updatedData) => {
    setLoading(true);
    try {
      const payload = {
        batchName: updatedData.batchName || updatedData.name,
        program: updatedData.program || updatedData.code,
        startDate: updatedData.startDate,
        endDate: updatedData.endDate,
        status: updatedData.status,
      };

      const response = await api.put(`/batches/update-batch/${id}`, payload);
      if (response.data.success) {
        setBatches((prev) =>
          prev.map((b) => (b._id === id ? response.data.batch : b))
        );
      }
      setError(null);
    } catch (err) {
      console.error("Failed to update batch:", err);
      setError(err.response?.data?.message || "Failed to update batch");
    } finally {
      setLoading(false);
    }
  };

  const deleteBatch = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/batches/delete-batch/${id}`);
      if (response.data.success) {
        setBatches((prev) => prev.filter((b) => b._id !== id));
      }
      setError(null);
    } catch (err) {
      console.error("Failed to delete batch:", err);
      setError(err.response?.data?.message || "Failed to delete batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BatchContext.Provider
      value={{
        batches,
        loading,
        error,
        fetchBatches,
        addBatch,
        updateBatch,
        deleteBatch,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatches = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error("useBatches must be used inside BatchProvider");
  }
  return context;
};

export const useBatch = useBatches;
