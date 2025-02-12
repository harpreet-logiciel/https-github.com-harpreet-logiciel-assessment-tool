import { type } from "os";

export interface Question {
  id: number;
  text: string;
  type: 'single-select' | 'multi-select' | 'radio' | 'text' | 'combined';
  options?: string[];
  placeholder?: string;
  showTextInput?: boolean;
}

export interface AssessmentState {
  currentQuestion: number;
  answers: Record<number, string | string[]>;
  additionalInfo?: Record<number, string>;
  email?: string;
  name?: string;
  companyName?: string;
  reportId?: string;
  sessionStartedAt: string;
}

export interface Report {
  id?: string;
  marketViabilityScore?: number;
  keyInsights?: string[];
  industryReadiness?: string;
  marketPotentialAnalysis: {
    currentMarketSize: string;
    growthProjections: string;
    nicheOpportunity: string;
    regionalAnalysis: string;
  };
  brandingStrategy?: {
    namesSuggestions: string[];
    visualGuidelines: string;
    positioningStatement: string;
  };
  painPointsMatrix: {
    userPersonas: Array<{
      name: string;
      role: string;
      painPoints: string[];
      needs: string[];
    }>;
    problemSolutionMap: Array<{
      problem: string;
      solution: string;
      value: string;
    }>;
    useCaseScenarios: string[];
  };
  mvpScope: {
    coreFeatures: string[];
    developmentPhases: Array<{
      phase: string;
      duration: string;
      deliverables: string[];
    }>;
    technicalRequirements: string[];
    timeline: {
      start: string;
      milestones: Array<{
        name: string;
        date: string;
      }>;
      completion: string;
    };
  };
  competitiveAnalysis: {
    directCompetitors: Array<{
      name: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    indirectCompetitors: Array<{
      name: string;
      threat: string;
      opportunity: string;
    }>;
    marketPosition: string;
    competitiveAdvantage: string[];
  };
  actionPlan: {
    immediateSteps: Array<{
      action: string;
      timeline: string;
      resources: string;
    }>;
    resourceRequirements: {
      technical: string[];
      human: string[];
      financial: string[];
    };
    riskMitigation: Array<{
      risk: string;
      impact: string;
      mitigation: string;
    }>;
    successMetrics: Array<{
      metric: string;
      target: string;
      timeline: string;
    }>;
  };
}
