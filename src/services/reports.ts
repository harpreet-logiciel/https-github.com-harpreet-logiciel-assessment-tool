import { generateAIReport } from '../utils/openai';
import type { AssessmentState, Report } from '../types';

const REPORTS_STORAGE_KEY = 'mvp-assessment-reports';

interface StoredReport {
  id: string;
  user_id: string;
  preview_report: any;
  full_report: Report;
  user_email?: string;
  created_at: string;
}

export async function generateAndSaveReports(state: AssessmentState, userId: string) {
  if (!userId) {
    throw new Error('Session expired. Please refresh the page.');
  }

  try {
    // Generate the full report
    const fullReport = await generateAIReport(state);
    if (!fullReport) {
      throw new Error('Failed to generate report');
    }

    // Create a preview version with limited data
    const previewReport = {
      marketViabilityScore: fullReport.marketViabilityScore || 85,
      keyInsights: fullReport.keyInsights || [
        "Market analysis shows strong potential for growth",
        "Clear target audience identified",
        "Competitive advantage in chosen sector",
        "Well-defined MVP scope"
      ],
      industryReadiness: fullReport.industryReadiness || 
        "Based on your responses, your product shows strong alignment with current market needs and industry trends.",
      marketPotentialSummary: {
        currentMarketSize: fullReport.marketPotentialAnalysis.currentMarketSize,
        growthProjections: fullReport.marketPotentialAnalysis.growthProjections
      }
    };

    // Generate a unique report ID
    const reportId = crypto.randomUUID();

    // Save the report to local storage
    const report: StoredReport = {
      id: reportId,
      user_id: userId,
      preview_report: previewReport,
      full_report: fullReport,
      created_at: new Date().toISOString()
    };

    // Get existing reports or initialize empty array
    const existingReports = getStoredReports();
    existingReports.push(report);

    // Save updated reports
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(existingReports));
    
    return { reportId, previewReport, fullReport };
  } catch (error) {
    console.error('Error in generateAndSaveReports:', error);
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to generate report. Please try again.');
    } else {
      throw new Error('Failed to generate report. Please try again.');
    }
  }
}

export async function getReportById(reportId: string): Promise<StoredReport | null> {
  if (!reportId) {
    throw new Error('Report ID is required');
  }

  try {
    const reports = getStoredReports();
    const report = reports.find(r => r.id === reportId);
    return report || null;
  } catch (error) {
    console.error('Error retrieving report:', error);
    return null;
  }
}

export async function convertAnonymousUser(
  userId: string, 
  userData: { 
    email: string; 
    name?: string; 
    companyName?: string; 
  }
) {
  try {
    // Update the user's email in their reports
    const reports = getStoredReports();
    const updatedReports = reports.map(report => {
      if (report.user_id === userId) {
        return {
          ...report,
          user_email: userData.email
        };
      }
      return report;
    });

    // Save updated reports
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
  } catch (error) {
    console.error('Error converting anonymous user:', error);
    throw new Error('Failed to update user information');
  }
}

// Helper function to get stored reports
function getStoredReports(): StoredReport[] {
  try {
    const reportsJson = localStorage.getItem(REPORTS_STORAGE_KEY);
    return reportsJson ? JSON.parse(reportsJson) : [];
  } catch (error) {
    console.error('Error parsing stored reports:', error);
    return [];
  }
}
