"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Serialize options to avoid unstable object references in useEffect deps
  const optionsString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts = { ...options };
    if (method === "POST" && !opts.data) {
      opts.data = {};
    }
    return opts;
  }, [method, optionsString]);

  useEffect(() => {
    if (!url) return;

    let isCancelled = false;

    const apiCall = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });

        if (!isCancelled) {
          setData(response);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Something went wrong.",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    apiCall();

    // Cleanup: prevent state updates on unmounted components
    return () => {
      isCancelled = true;
    };
  }, [url, method, refreshIndex, requestOptions]);

  const refetch = () => setRefreshIndex((prev) => prev + 1);

  return { data, loading, error, refetch };
};

export default useFetch;
