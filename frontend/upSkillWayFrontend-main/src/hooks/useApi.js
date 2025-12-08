/**
 * Custom React Hook for API calls
 * Provides loading, error, and data states
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

/**
 * Hook for fetching data from API
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {boolean} immediate - Whether to fetch immediately on mount
 * @returns {object} { data, loading, error, refetch }
 */
export const useFetch = (endpoint, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.get(endpoint, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for POST requests
 * @returns {object} { mutate, loading, error, data }
 */
export const usePost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (endpoint, payload, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.post(endpoint, payload, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, data };
};

/**
 * Hook for PUT requests
 * @returns {object} { mutate, loading, error, data }
 */
export const usePut = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (endpoint, payload, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.put(endpoint, payload, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, data };
};

/**
 * Hook for DELETE requests
 * @returns {object} { mutate, loading, error, data }
 */
export const useDelete = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.delete(endpoint, options);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, data };
};

export default useFetch;
