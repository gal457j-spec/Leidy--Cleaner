/**
 * useAnalytics Hook
 * Fetch and manage analytics data from API
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Use consistent API configuration across app
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`;

export const useAnalytics = (dateRange = '30days') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch main analytics dashboard
      const response = await axios.get(
        `${API_BASE}/analytics/dashboard?dateRange=${dateRange}`,
        config
      );

      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const fetchRevenueStats = useCallback(async (options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_BASE}/analytics/revenue`,
        { ...config, params: options }
      );

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchConversionStats = useCallback(async (options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_BASE}/analytics/conversion`,
        { ...config, params: options }
      );

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchCustomerAnalytics = useCallback(async (options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_BASE}/analytics/customers`,
        { ...config, params: options }
      );

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchChurnAnalytics = useCallback(async (options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_BASE}/analytics/churn`,
        { ...config, params: options }
      );

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchBookingStats = useCallback(async (options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(
        `${API_BASE}/analytics/bookings`,
        { ...config, params: options }
      );

      return response.data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const exportReport = useCallback(async (format = 'pdf', options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      };

      const response = await axios.post(
        `${API_BASE}/analytics/export`,
        { format, dateRange, ...options },
        config
      );

      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      throw err;
    }
  }, [dateRange]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
    fetchRevenueStats,
    fetchConversionStats,
    fetchCustomerAnalytics,
    fetchChurnAnalytics,
    fetchBookingStats,
    exportReport
  };
};

export default useAnalytics;
