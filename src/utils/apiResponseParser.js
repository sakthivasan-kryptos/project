// src/utils/apiResponseParser.js
// Utility functions to parse New-Review Upload Document API responses

// Parse API response and extract data for dashboard update
export const extractDashboardData = (apiResponse) => {
  try {
    const { compliance_summary, mandatory_compliance_issues } = apiResponse;
    
    if (!compliance_summary) {
      throw new Error('Missing compliance_summary in API response');
    }

    return {
      compliance_status: compliance_summary.status || 'Unknown',
      critical_issues: compliance_summary.critical_issues || 0,
      must_fix_items: compliance_summary.must_fix_items || [],
      key_issues: mandatory_compliance_issues || [],
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting dashboard data:', error);
    throw new Error('Failed to extract dashboard data from API response');
  }
};

// Parse API response and extract data for All-Reviews section
export const extractReviewsData = (apiResponse, metadata = {}) => {
  try {
    const {
      compliance_summary,
      mandatory_compliance_issues,
      best_practice_recommendations,
      document_inconsistencies
    } = apiResponse;

    const reviewEntry = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      company: metadata.company || 'Unknown Company',
      document_type: metadata.document_type || 'Unknown Document',
      compliance_issues: mandatory_compliance_issues || [],
      best_practices: best_practice_recommendations || [],
      inconsistencies: document_inconsistencies || [],
      compliance_summary: compliance_summary || {},
      status: compliance_summary?.status || 'Unknown',
      critical_count: compliance_summary?.critical_issues || 0,
      metadata
    };

    return [reviewEntry];
  } catch (error) {
    console.error('Error extracting reviews data:', error);
    throw new Error('Failed to extract reviews data from API response');
  }
};

// Parse API response and extract data for Regulations and Reports
export const extractRegulationsData = (apiResponse) => {
  try {
    const { mandatory_compliance_issues } = apiResponse;
    
    if (!mandatory_compliance_issues || !Array.isArray(mandatory_compliance_issues)) {
      return { violations: [], articles: {} };
    }

    const violations = [];
    const articles = {};

    mandatory_compliance_issues.forEach((issue, index) => {
      const violation = {
        id: `violation_${Date.now()}_${index}`,
        article: issue.qfc_article || 'Unknown Article',
        violation: issue.violation || 'Unknown Violation',
        required: issue.qfc_requires || 'Unknown Requirement',
        fix_required: issue.fix_required || 'No fix specified',
        severity: issue.severity || 'Unknown',
        timestamp: new Date().toISOString()
      };

      violations.push(violation);

      // Group by article for easier access
      const articleKey = violation.article;
      if (!articles[articleKey]) {
        articles[articleKey] = [];
      }
      articles[articleKey].push(violation);
    });

    return {
      violations,
      articles,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting regulations data:', error);
    throw new Error('Failed to extract regulations data from API response');
  }
};

// Parse API response and extract comprehensive compliance data
export const extractComplianceData = (apiResponse) => {
  try {
    const {
      compliance_summary,
      mandatory_compliance_issues,
      best_practice_recommendations,
      document_inconsistencies
    } = apiResponse;

    return {
      summary: compliance_summary || {},
      mandatory_issues: mandatory_compliance_issues || [],
      recommendations: best_practice_recommendations || [],
      inconsistencies: document_inconsistencies || [],
      total_issues: (mandatory_compliance_issues || []).length,
      critical_issues: compliance_summary?.critical_issues || 0,
      status: compliance_summary?.status || 'Unknown',
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error extracting compliance data:', error);
    throw new Error('Failed to extract compliance data from API response');
  }
};

// Validate API response structure
export const validateApiResponse = (apiResponse) => {
  const requiredFields = [
    'compliance_summary',
    'mandatory_compliance_issues'
  ];

  const missingFields = requiredFields.filter(field => !(field in apiResponse));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields in API response: ${missingFields.join(', ')}`);
  }

  // Validate compliance_summary structure
  if (apiResponse.compliance_summary && typeof apiResponse.compliance_summary !== 'object') {
    throw new Error('compliance_summary must be an object');
  }

  // Validate mandatory_compliance_issues structure
  if (apiResponse.mandatory_compliance_issues && !Array.isArray(apiResponse.mandatory_compliance_issues)) {
    throw new Error('mandatory_compliance_issues must be an array');
  }

  return true;
};

// Handle null or missing fields gracefully
export const sanitizeApiResponse = (apiResponse) => {
  try {
    const sanitized = {
      compliance_summary: apiResponse.compliance_summary || {},
      mandatory_compliance_issues: apiResponse.mandatory_compliance_issues || [],
      best_practice_recommendations: apiResponse.best_practice_recommendations || [],
      document_inconsistencies: apiResponse.document_inconsistencies || []
    };

    // Ensure compliance_summary has required structure
    sanitized.compliance_summary = {
      status: sanitized.compliance_summary.status || 'Unknown',
      critical_issues: sanitized.compliance_summary.critical_issues || 0,
      must_fix_items: sanitized.compliance_summary.must_fix_items || [],
      ...sanitized.compliance_summary
    };

    // Ensure mandatory_compliance_issues have required structure
    sanitized.mandatory_compliance_issues = sanitized.mandatory_compliance_issues.map((issue, index) => ({
      qfc_article: issue?.qfc_article || `Unknown Article ${index + 1}`,
      violation: issue?.violation || 'Unknown Violation',
      qfc_requires: issue?.qfc_requires || 'Unknown Requirement',
      fix_required: issue?.fix_required || 'No fix specified',
      severity: issue?.severity || 'Unknown',
      ...issue
    }));

    return sanitized;
  } catch (error) {
    console.error('Error sanitizing API response:', error);
    throw new Error('Failed to sanitize API response');
  }
};

// Create mock API response for testing
export const createMockApiResponse = () => {
  return {
    compliance_summary: {
      status: "Non-Compliant",
      critical_issues: 5,
      must_fix_items: [
        "Reduce probation period to maximum 3 months",
        "Increase annual leave to 20 working days",
        "Add overtime pay clause at 125%",
        "Update sick leave policy to comply with QFC standards",
        "Revise termination notice requirements"
      ]
    },
    mandatory_compliance_issues: [
      {
        qfc_article: "Article 18",
        violation: "Probation period exceeds maximum allowed",
        qfc_requires: "Maximum probation period of 3 months",
        fix_required: "Reduce probation period from 6 months to 3 months",
        severity: "Critical"
      },
      {
        qfc_article: "Article 23",
        violation: "Insufficient annual leave provision",
        qfc_requires: "Minimum 20 working days annual leave",
        fix_required: "Increase annual leave from 15 to 20 working days",
        severity: "Critical"
      },
      {
        qfc_article: "Article 45",
        violation: "Missing overtime compensation clause",
        qfc_requires: "Overtime pay at minimum 125% of regular rate",
        fix_required: "Add overtime compensation clause with 125% rate",
        severity: "High"
      }
    ],
    best_practice_recommendations: [
      {
        area: "Employee Benefits",
        recommendation: "Consider adding health insurance coverage",
        impact: "Improved employee satisfaction and retention"
      },
      {
        area: "Performance Management",
        recommendation: "Implement structured performance review process",
        impact: "Better employee development and career progression"
      }
    ],
    document_inconsistencies: [
      {
        issue: "Conflicting sick leave policies",
        description: "HR Manual states 10 days, Employment Contract states 7 days",
        suggested_solution: "Standardize to 10 days across all documents"
      },
      {
        issue: "Inconsistent termination notice periods",
        description: "Different notice periods specified in different sections",
        suggested_solution: "Align all references to 30 days notice period"
      }
    ]
  };
};