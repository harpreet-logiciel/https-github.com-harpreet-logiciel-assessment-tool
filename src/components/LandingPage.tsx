import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import type { AssessmentState } from '../types';

const getInitialState = (): AssessmentState => ({
  currentQuestion: 1,
  answers: {},
  additionalInfo: {},
  sessionStartedAt: new Date().toISOString()
});

export function LandingPage({ onStartAssessment }: { onStartAssessment: () => void }) {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-24 text-center">
        <div className="text-[#B91C1C] font-semibold mb-4 tracking-wide">
          DEDICATED SOFTWARE DEVELOPMENT TEAM
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Evaluate Your MVP Readiness in 10 Minutes
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Get AI-powered insights and actionable recommendations for your product idea
        </p>

        <Button 
          onClick={onStartAssessment}
          className="text-lg px-8 py-4 flex items-center gap-2 mx-auto"
        >
          Start Assessment
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            'No Registration Required',
            'Free Basic Assessment',
            'Comprehensive Report via Email'
          ].map((benefit) => (
            <div
              key={benefit}
              className="bg-white p-8 rounded-xl shadow-logiciel hover:shadow-xl transition-shadow duration-300 flex items-start gap-4"
            >
              <CheckCircle2 className="w-6 h-6 text-[#B91C1C] flex-shrink-0" />
              <p className="text-lg font-medium text-gray-800">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
