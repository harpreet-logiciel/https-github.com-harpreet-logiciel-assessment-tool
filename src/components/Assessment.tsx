import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Code,
  Rocket,
  CheckCircle2,
  Info,
  Stethoscope,
  GraduationCap,
  Building2,
  Wallet,
  ShoppingBag,
  Film,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { questions } from '../data/questions';
import { generateAndSaveReports } from '../services/reports';
import type { AssessmentState } from '../types';

interface AssessmentProps {
  state: AssessmentState;
  setState: React.Dispatch<React.SetStateAction<AssessmentState>>;
  userId: string | null;
  sessionId: string | null;
  onReportGenerated: (reportId: string) => void;
}

export function Assessment({
  state,
  setState,
  userId,
  sessionId,
  onReportGenerated
}: AssessmentProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentQuestion = questions[state.currentQuestion - 1];
  const isLastQuestion = state.currentQuestion === questions.length;
  const isFirstQuestion = state.currentQuestion === 1;

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const answer = state.answers[state.currentQuestion];
    if (!answer) return false;
    
    // For multi-select, ensure at least one option is selected
    if (currentQuestion.type === 'multi-select') {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    // For "Other" option, ensure additional info is provided
    if (answer === 'Other' || (Array.isArray(answer) && answer.includes('Other'))) {
      return !!state.additionalInfo?.[state.currentQuestion];
    }
    
    return true;
  };

  const handleShowPreview = async () => {
    if (!userId) {
      setError('Session expired. Please refresh the page.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Validate that all required questions are answered
      const unansweredQuestions = questions.filter(q => !state.answers[q.id]);
      if (unansweredQuestions.length > 0) {
        throw new Error('Please answer all questions before generating the report.');
      }

      const { reportId } = await generateAndSaveReports(state, userId);
      if (!reportId) {
        throw new Error('Failed to generate report ID');
      }

      navigate(`/mvp-assessment/report/${reportId}`);
    } catch (error) {
      console.error('Error generating reports:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (state.currentQuestion < questions.length) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      handleShowPreview();
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      navigate('/mvp-assessment');
    } else {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  const handleAnswer = (answer: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: answer,
      },
    }));
  };

  const handleAdditionalInfo = (info: string) => {
    setState(prev => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [prev.currentQuestion]: info,
      },
    }));
  };

  const handleMultiSelect = (option: string) => {
    const currentAnswers = (state.answers[state.currentQuestion] as string[]) || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(a => a !== option)
      : [...currentAnswers, option];
    handleAnswer(newAnswers);
  };

  // Helper function to check if "Other" is selected
  const isOtherSelected = (questionId: number) => {
    const answer = state.answers[questionId];
    if (Array.isArray(answer)) {
      return answer.includes('Other');
    }
    return answer === 'Other';
  };

  // Helper function to get the appropriate icon for startup stage
  const getStageIcon = (option: string) => {
    switch (option) {
      case "Early Stage with just an idea":
        return <Lightbulb className="w-6 h-6 mb-4" />;
      case "Early Stage with some wireframing":
        return <Code className="w-6 h-6 mb-4" />;
      case "Early Stage with an already developed MVP":
        return <Rocket className="w-6 h-6 mb-4" />;
      default:
        return null;
    }
  };

  // Helper function to get industry icon
  const getIndustryIcon = (option: string) => {
    switch (option) {
      case "Healthcare (Medical Devices, Digital Health, Biotech)":
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
      case "Education (EdTech, E-learning, Training)":
        return <GraduationCap className="w-6 h-6 text-green-600" />;
      case "Real Estate (PropTech, Management, Investment)":
        return <Building2 className="w-6 h-6 text-orange-600" />;
      case "Fintech (Payments, Banking, Insurance)":
        return <Wallet className="w-6 h-6 text-purple-600" />;
      case "Retail/E-Commerce (B2C, B2B, Marketplaces)":
        return <ShoppingBag className="w-6 h-6 text-red-600" />;
      case "Entertainment/Media (Streaming, Gaming, Content)":
        return <Film className="w-6 h-6 text-indigo-600" />;
      case "Other":
        return <MoreHorizontal className="w-6 h-6 text-gray-600" />;
      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#B91C1C] mb-4" />
        <p className="text-gray-600">Generating your assessment report...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ProgressBar 
        current={state.currentQuestion} 
        total={questions.length} 
      />
      
      <div className="mt-12 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            {currentQuestion.text}
          </h2>
          {currentQuestion.type === 'multi-select' && (
            <div className="flex items-center gap-2 text-sm text-logiciel-blue-600">
              <Info className="w-4 h-4" />
              <span>You can select multiple options</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {currentQuestion.id === 1 ? (
            // Special 3-column layout for startup stage question
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestion.options?.slice(0, 3).map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                    state.answers[state.currentQuestion] === option
                      ? 'border-[#B91C1C] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getStageIcon(option)}
                  <span className="text-center">{option}</span>
                  {state.answers[state.currentQuestion] === option && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-[#B91C1C]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : currentQuestion.id === 2 ? (
            // Single column layout for Industry/Domain Focus
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <div key={option}>
                  <button
                    onClick={() => handleAnswer(option)}
                    className={`relative w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      state.answers[state.currentQuestion] === option
                        ? 'border-[#B91C1C] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getIndustryIcon(option)}
                    </div>
                    <span className="flex-grow text-left">{option}</span>
                  </button>
                  {option === 'Other' && isOtherSelected(currentQuestion.id) && (
                    <div className="mt-2 ml-10">
                      <input
                        type="text"
                        value={state.additionalInfo?.[currentQuestion.id] || ''}
                        onChange={(e) => handleAdditionalInfo(e.target.value)}
                        placeholder="Please specify your industry"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : currentQuestion.type === 'multi-select' ? (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <div key={option}>
                  <button
                    onClick={() => handleMultiSelect(option)}
                    className={`relative w-full p-4 text-left rounded-lg border-2 transition-all ${
                      (state.answers[state.currentQuestion] as string[] || []).includes(option)
                        ? 'border-[#B91C1C] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 border-2 rounded ${
                        (state.answers[state.currentQuestion] as string[] || []).includes(option)
                          ? 'border-[#B91C1C] bg-[#B91C1C]'
                          : 'border-gray-400'
                      }`}>
                        {(state.answers[state.currentQuestion] as string[] || []).includes(option) && (
                          <CheckCircle2 className="w-full h-full text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                  {option === 'Other' && isOtherSelected(currentQuestion.id) && (
                    <div className="mt-2 ml-10">
                      <input
                        type="text"
                        value={state.additionalInfo?.[currentQuestion.id] || ''}
                        onChange={(e) => handleAdditionalInfo(e.target.value)}
                        placeholder="Please specify"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : currentQuestion.type === 'radio' ? (
            <div className="flex gap-4 justify-center">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`flex-1 max-w-[200px] p-4 rounded-lg border-2 transition-all text-center ${
                    state.answers[state.currentQuestion] === option
                      ? 'border-[#B91C1C] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <div key={option}>
                  <button
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      state.answers[state.currentQuestion] === option
                        ? 'border-[#B91C1C] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                  {option === 'Other' && isOtherSelected(currentQuestion.id) && (
                    <div className="mt-2 ml-10">
                      <input
                        type="text"
                        value={state.additionalInfo?.[currentQuestion.id] || ''}
                        onChange={(e) => handleAdditionalInfo(e.target.value)}
                        placeholder="Please specify"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'radio' && state.answers[state.currentQuestion] === 'Yes' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {currentQuestion.placeholder || 'Additional Information'}
              </label>
              <textarea
                value={state.additionalInfo?.[currentQuestion.id] || ''}
                onChange={(e) => handleAdditionalInfo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B91C1C] focus:border-transparent min-h-[100px]"
                placeholder={currentQuestion.placeholder || 'Please provide additional details...'}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className="flex items-center gap-2"
            >
              {isLastQuestion ? 'View Report' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
