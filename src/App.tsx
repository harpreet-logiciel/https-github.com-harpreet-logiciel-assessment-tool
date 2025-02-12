import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Assessment } from './components/Assessment';
import { useAssessment } from './hooks/useAssessment';
import { AlertTriangle } from 'lucide-react';
import { ReportPreview } from './components/ReportPreview';
import { FullReport } from './components/FullReport';
import { getReportById } from './services/reports';

function App() {
  const { state, setState, userId, sessionId, isLoading, error } = useAssessment();
  const [showAssessment, setShowAssessment] = useState(false);
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    setShowAssessment(true);
    navigate('/mvp-assessment/start');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-700">Connection Error</h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Redirect root to logiciel.io */}
      <Route path="/" element={<Navigate to="https://logiciel.io" replace />} />
      
      {/* MVP Assessment routes */}
      <Route path="/mvp-assessment" element={<LandingPage onStartAssessment={handleStartAssessment} />} />
      <Route 
        path="/mvp-assessment/start" 
        element={
          <Assessment 
            state={state} 
            setState={setState} 
            userId={userId} 
            sessionId={sessionId}
            onReportGenerated={(reportId) => {
              navigate(`/mvp-assessment/report/${reportId}`);
            }}
          />
        } 
      />
      <Route 
        path="/mvp-assessment/report/:reportId" 
        element={<ReportRoute state={state} userId={userId} />} 
      />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/report/preview/:reportId" element={<Navigate to="/mvp-assessment/report/:reportId" replace />} />
      <Route path="/report/full/:reportId" element={<Navigate to="/mvp-assessment/report/:reportId" replace />} />
      
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/mvp-assessment" replace />} />
    </Routes>
  );
}

function ReportRoute({ state, userId }: { state: any, userId: string | null }) {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { reportId } = useParams();

  React.useEffect(() => {
    let mounted = true;

    async function loadReport() {
      if (!reportId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getReportById(reportId);
        
        if (mounted) {
          if (data) {
            setReportData(data);
          } else {
            setError('Report not found');
          }
        }
      } catch (err) {
        console.error('Error loading report:', err);
        if (mounted) {
          setError('Failed to load report');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      mounted = false;
    };
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-700">Error</h2>
          </div>
          <p className="text-red-600 mb-4">{error || 'Report not found'}</p>
          <button
            onClick={() => navigate('/mvp-assessment')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Show full report if user has provided email, otherwise show preview
  const hasEmail = state.email || reportData.user_email;
  
  if (hasEmail) {
    return <FullReport report={reportData.full_report} />;
  }

  return (
    <ReportPreview
      state={state}
      userId={userId}
      previewData={reportData.preview_report}
      reportId={reportData.id}
      onGetFullReport={() => {
        // This will show the email form in ReportPreview
        // After email submission, it will reload the page and show full report
        window.location.reload();
      }}
    />
  );
}

export default App;
