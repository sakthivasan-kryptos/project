// src/services/localStorageService.js
// Local storage service for handling API responses with data integrity

const STORAGE_KEYS = {
  API_RESPONSES: 'qfc_api_responses',
  COMPLIANCE_DATA: 'qfc_compliance_data',
  DASHBOARD_DATA: 'qfc_dashboard_data',
  REVIEWS_DATA: 'qfc_reviews_data',
  REGULATIONS_DATA: 'qfc_regulations_data',
  AUDIT_TRAIL: 'qfc_audit_trail'
};

// Store API response with metadata and audit trail
export const storeApiResponse = (apiResponse, metadata = {}) => {
  try {
    const timestamp = new Date().toISOString();
    const responseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const storedResponse = {
      id: responseId,
      timestamp,
      data: apiResponse,
      metadata: {
        source: 'new_review_upload_api',
        version: '1.0',
        ...metadata
      }
    };

    // Get existing responses
    const existingResponses = getStoredResponses();
    existingResponses.push(storedResponse);

    // Store updated responses
    localStorage.setItem(STORAGE_KEYS.API_RESPONSES, JSON.stringify(existingResponses));
    
    // Add to audit trail
    addAuditEntry({
      action: 'api_response_stored',
      responseId,
      timestamp,
      metadata
    });

    return responseId;
  } catch (error) {
    console.error('Error storing API response:', error);
    throw new Error('Failed to store API response');
  }
};

// Retrieve all stored API responses
export const getStoredResponses = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.API_RESPONSES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving stored responses:', error);
    return [];
  }
};

// Retrieve specific API response by ID
export const getApiResponseById = (responseId) => {
  try {
    const responses = getStoredResponses();
    return responses.find(response => response.id === responseId);
  } catch (error) {
    console.error('Error retrieving API response by ID:', error);
    return null;
  }
};

// Store compliance data extracted from API response
export const storeComplianceData = (complianceData) => {
  try {
    const timestamp = new Date().toISOString();
    const existing = getComplianceData();
    
    const updatedData = {
      ...existing,
      lastUpdated: timestamp,
      ...complianceData
    };

    localStorage.setItem(STORAGE_KEYS.COMPLIANCE_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'compliance_data_updated',
      timestamp,
      dataKeys: Object.keys(complianceData)
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing compliance data:', error);
    throw new Error('Failed to store compliance data');
  }
};

// Retrieve compliance data
export const getComplianceData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving compliance data:', error);
    return {};
  }
};

// Store dashboard data
export const storeDashboardData = (dashboardData) => {
  try {
    const timestamp = new Date().toISOString();
    const updatedData = {
      ...dashboardData,
      lastUpdated: timestamp
    };

    localStorage.setItem(STORAGE_KEYS.DASHBOARD_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'dashboard_data_updated',
      timestamp
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing dashboard data:', error);
    throw new Error('Failed to store dashboard data');
  }
};

// Retrieve dashboard data
export const getDashboardData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_DATA);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving dashboard data:', error);
    return null;
  }
};

// Store reviews data
export const storeReviewsData = (reviewsData) => {
  try {
    const timestamp = new Date().toISOString();
    const existing = getReviewsData();
    
    const updatedData = {
      reviews: [...(existing.reviews || []), ...reviewsData],
      lastUpdated: timestamp
    };

    localStorage.setItem(STORAGE_KEYS.REVIEWS_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'reviews_data_updated',
      timestamp,
      newReviewsCount: reviewsData.length
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing reviews data:', error);
    throw new Error('Failed to store reviews data');
  }
};

// Retrieve reviews data
export const getReviewsData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS_DATA);
    return stored ? JSON.parse(stored) : { reviews: [] };
  } catch (error) {
    console.error('Error retrieving reviews data:', error);
    return { reviews: [] };
  }
};

// Store regulations and reports data
export const storeRegulationsData = (regulationsData) => {
  try {
    const timestamp = new Date().toISOString();
    const existing = getRegulationsData();
    
    const updatedData = {
      ...existing,
      ...regulationsData,
      lastUpdated: timestamp
    };

    localStorage.setItem(STORAGE_KEYS.REGULATIONS_DATA, JSON.stringify(updatedData));
    
    addAuditEntry({
      action: 'regulations_data_updated',
      timestamp
    });

    return updatedData;
  } catch (error) {
    console.error('Error storing regulations data:', error);
    throw new Error('Failed to store regulations data');
  }
};

// Retrieve regulations data
export const getRegulationsData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REGULATIONS_DATA);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error retrieving regulations data:', error);
    return {};
  }
};

// Add entry to audit trail
export const addAuditEntry = (entry) => {
  try {
    const existing = getAuditTrail();
    const auditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    existing.push(auditEntry);
    
    // Keep only last 1000 entries to prevent storage overflow
    const trimmed = existing.slice(-1000);
    
    localStorage.setItem(STORAGE_KEYS.AUDIT_TRAIL, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error adding audit entry:', error);
  }
};

// Retrieve audit trail
export const getAuditTrail = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_TRAIL);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving audit trail:', error);
    return [];
  }
};

// Clear all stored data (for testing/reset purposes)
export const clearAllStoredData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    addAuditEntry({
      action: 'all_data_cleared',
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing stored data:', error);
    return false;
  }
};

// Export storage keys for use in other components
export { STORAGE_KEYS };