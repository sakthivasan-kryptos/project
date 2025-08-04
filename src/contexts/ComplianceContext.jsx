// src/contexts/ComplianceContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  getDashboardData, 
  getReviewsData, 
  getRegulationsData, 
  getComplianceData 
} from '../services/localStorageService.js';

// Initial state
const initialState = {
  dashboardData: null,
  reviewsData: { reviews: [] },
  regulationsData: {},
  complianceData: {},
  loading: false,
  error: null,
  lastUpdated: null
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_DASHBOARD_DATA: 'UPDATE_DASHBOARD_DATA',
  UPDATE_REVIEWS_DATA: 'UPDATE_REVIEWS_DATA',
  UPDATE_REGULATIONS_DATA: 'UPDATE_REGULATIONS_DATA',
  UPDATE_COMPLIANCE_DATA: 'UPDATE_COMPLIANCE_DATA',
  REFRESH_ALL_DATA: 'REFRESH_ALL_DATA',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const complianceReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ActionTypes.UPDATE_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.UPDATE_REVIEWS_DATA:
      return {
        ...state,
        reviewsData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.UPDATE_REGULATIONS_DATA:
      return {
        ...state,
        regulationsData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.UPDATE_COMPLIANCE_DATA:
      return {
        ...state,
        complianceData: action.payload,
        lastUpdated: new Date().toISOString(),
        error: null
      };
      
    case ActionTypes.REFRESH_ALL_DATA:
      return {
        ...state,
        dashboardData: action.payload.dashboardData,
        reviewsData: action.payload.reviewsData,
        regulationsData: action.payload.regulationsData,
        complianceData: action.payload.complianceData,
        lastUpdated: new Date().toISOString(),
        loading: false,
        error: null
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Create context
const ComplianceContext = createContext();

// Context provider component
export const ComplianceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(complianceReducer, initialState);

  // Load initial data from local storage
  useEffect(() => {
    loadAllData();
  }, []);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const updateDashboardData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_DASHBOARD_DATA, payload: data });
  };

  const updateReviewsData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_REVIEWS_DATA, payload: data });
  };

  const updateRegulationsData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_REGULATIONS_DATA, payload: data });
  };

  const updateComplianceData = (data) => {
    dispatch({ type: ActionTypes.UPDATE_COMPLIANCE_DATA, payload: data });
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const dashboardData = getDashboardData();
      const reviewsData = getReviewsData();
      const regulationsData = getRegulationsData();
      const complianceData = getComplianceData();

      dispatch({
        type: ActionTypes.REFRESH_ALL_DATA,
        payload: {
          dashboardData,
          reviewsData,
          regulationsData,
          complianceData
        }
      });
    } catch (error) {
      console.error('Error loading compliance data:', error);
      setError('Failed to load compliance data');
    }
  };

  const refreshData = async () => {
    await loadAllData();
  };

  // Helper functions for computed values
  const getTotalReviews = () => {
    return state.reviewsData?.reviews?.length || 0;
  };

  const getCriticalIssuesCount = () => {
    return state.dashboardData?.critical_issues || 0;
  };

  const getComplianceStatus = () => {
    return state.dashboardData?.compliance_status || '0';
  };

  const getRecentReviews = (limit = 5) => {
    const reviews = state.reviewsData?.reviews || [];
    return reviews
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  };

  const getViolationsByArticle = () => {
    return state.regulationsData?.articles || {};
  };

  const getAllViolations = () => {
    return state.regulationsData?.violations || [];
  };

  const getMustFixItems = () => {
    return state.dashboardData?.must_fix_items || [];
  };

  const getKeyIssues = () => {
    return state.dashboardData?.key_issues || [];
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    clearError,
    updateDashboardData,
    updateReviewsData,
    updateRegulationsData,
    updateComplianceData,
    refreshData,
    
    // Computed values
    getTotalReviews,
    getCriticalIssuesCount,
    getComplianceStatus,
    getRecentReviews,
    getViolationsByArticle,
    getAllViolations,
    getMustFixItems,
    getKeyIssues
  };

  return (
    <ComplianceContext.Provider value={contextValue}>
      {children}
    </ComplianceContext.Provider>
  );
};

// Custom hook to use compliance context
export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};

// Export action types for external use
export { ActionTypes };