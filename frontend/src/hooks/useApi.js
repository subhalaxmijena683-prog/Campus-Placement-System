import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(url);
      setData(response.data);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load data";
      setError(message);
      if (!options.silent) toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [url, options.silent]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
};
