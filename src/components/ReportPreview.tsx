import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Gauge, Lightbulb, Activity, AlertTriangle, Share2 } from 'lucide-react';
import { Button } from './Button';
import { EmailForm } from './EmailForm';
import type { AssessmentState } from '../types';

interface ReportPreviewProps {
  state: AssessmentState;
  userId: string | null;
  previewData: any;
  reportId: string;
  onGetFullReport: () => void;
}

export function ReportPreview({ 
  state, 
  userId,
  previewData, 
  reportId,
  onGetFullReport 
}: ReportPreviewProps) {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-700">Report Not Found</h2>
          </div>
          <p className="text-red-600 mb-4">The requested report could not be found.</p>
          <button
            onClick={() => navigate('/mvp-assessment', { replace: true })}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: 'MVP Assessment Report Preview',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Report URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (showEmailForm) {
    return (
      <EmailForm 
        state={state}
        userId={userId!}
        reportId={reportId}
        onCancel={() => setShowEmailForm(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          MVP Assessment Preview
        </h1>
        <Button
          variant="secondary"
          onClick={handleShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Market Viability Score */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Gauge className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Market Viability Score</h2>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <span className="text-3xl font-bold">{previewData.marketViabilityScore}</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold">Key Insights</h2>
        </div>
        <ul className="space-y-3">
          {previewData.keyInsights.map((insight: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Industry Readiness */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold">Industry Readiness</h2>
        </div>
        <p className="text-gray-700">{previewData.industryReadiness}</p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => setShowEmailForm(true)}
          className="w-full py-4 text-lg"
        >
          View Full Report
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate('/mvp-assessment', { replace: true })}
          className="w-full py-4 text-lg"
        >
          Start New Assessment
        </Button>
      </div>
    </div>
  );
}
