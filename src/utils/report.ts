import { generateAIReport } from './openai';
import type { AssessmentState, Report } from '../types';

export async function calculateReport(state: AssessmentState): Promise<Report> {
  try {
    const report = await generateAIReport(state);
    if (!isValidReport(report)) {
      throw new Error('Invalid report structure from AI');
    }
    return report;
  } catch (error) {
    console.error('Error calculating report:', error);
    const staticReport = generateStaticReport(state);
    if (!isValidReport(staticReport)) {
      throw new Error('Invalid static report structure');
    }
    return staticReport;
  }
}

export async function generateFullReport(state: AssessmentState): Promise<Report> {
  try {
    const report = await calculateReport(state);
    return report;
  } catch (error) {
    console.error('Error generating full report:', error);
    throw error; // Re-throw to handle in the component
  }
}

// Helper function to validate report structure
function isValidReport(report: any): report is Report {
  if (!report) return false;

  try {
    // Required sections
    const requiredSections = [
      'marketPotentialAnalysis',
      'painPointsMatrix',
      'mvpScope',
      'competitiveAnalysis',
      'actionPlan'
    ];

    // Check if all required sections exist
    for (const section of requiredSections) {
      if (!report[section] || typeof report[section] !== 'object') {
        console.error(`Missing or invalid section: ${section}`);
        return false;
      }
    }

    // Validate marketPotentialAnalysis
    const { marketPotentialAnalysis } = report;
    const marketFields = ['currentMarketSize', 'growthProjections', 'nicheOpportunity', 'regionalAnalysis'];
    for (const field of marketFields) {
      if (typeof marketPotentialAnalysis[field] !== 'string') {
        console.error(`Invalid market analysis field: ${field}`);
        return false;
      }
    }

    // Validate painPointsMatrix
    const { painPointsMatrix } = report;
    if (!Array.isArray(painPointsMatrix.userPersonas) ||
        !Array.isArray(painPointsMatrix.problemSolutionMap) ||
        !Array.isArray(painPointsMatrix.useCaseScenarios)) {
      console.error('Invalid pain points matrix structure');
      return false;
    }

    // Validate mvpScope
    const { mvpScope } = report;
    if (!Array.isArray(mvpScope.coreFeatures) ||
        !Array.isArray(mvpScope.developmentPhases) ||
        !Array.isArray(mvpScope.technicalRequirements) ||
        !mvpScope.timeline) {
      console.error('Invalid MVP scope structure');
      return false;
    }

    // Validate competitiveAnalysis
    const { competitiveAnalysis } = report;
    if (!Array.isArray(competitiveAnalysis.directCompetitors) ||
        !Array.isArray(competitiveAnalysis.indirectCompetitors) ||
        typeof competitiveAnalysis.marketPosition !== 'string' ||
        !Array.isArray(competitiveAnalysis.competitiveAdvantage)) {
      console.error('Invalid competitive analysis structure');
      return false;
    }

    // Validate actionPlan
    const { actionPlan } = report;
    if (!Array.isArray(actionPlan.immediateSteps) ||
        !actionPlan.resourceRequirements ||
        !Array.isArray(actionPlan.riskMitigation) ||
        !Array.isArray(actionPlan.successMetrics)) {
      console.error('Invalid action plan structure');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating report:', error);
    return false;
  }
}

function generateStaticReport(_state: AssessmentState): Report {
  return {
    marketViabilityScore: 85,
    keyInsights: [
      "Strong market potential in chosen sector",
      "Clear value proposition identified",
      "Competitive advantage in target market"
    ],
    industryReadiness: "Your product shows strong alignment with current market needs",
    marketPotentialAnalysis: {
      currentMarketSize: "The current market size is estimated at $50B globally",
      growthProjections: "Expected CAGR of 15% over the next 5 years",
      nicheOpportunity: "Significant opportunity in underserved SMB segment",
      regionalAnalysis: "Strongest growth potential in North America and Europe"
    },
    brandingStrategy: {
      namesSuggestions: ["InnovatePro", "FlexiFlow", "AgileCore"],
      visualGuidelines: "Modern, minimalist design with blue and green color scheme",
      positioningStatement: "Enterprise-grade solutions made accessible for growing businesses"
    },
    painPointsMatrix: {
      userPersonas: [
        {
          name: "Sarah",
          role: "Project Manager",
          painPoints: ["Time-consuming manual processes", "Lack of visibility"],
          needs: ["Automation", "Real-time reporting"]
        },
        {
          name: "John",
          role: "Team Lead",
          painPoints: ["Communication gaps", "Resource allocation"],
          needs: ["Centralized communication", "Resource management"]
        }
      ],
      problemSolutionMap: [
        {
          problem: "Manual task management",
          solution: "Automated workflows",
          value: "60% time savings"
        },
        {
          problem: "Scattered communication",
          solution: "Centralized platform",
          value: "40% improved efficiency"
        }
      ],
      useCaseScenarios: [
        "Automated task assignment",
        "Real-time progress tracking",
        "Resource optimization"
      ]
    },
    mvpScope: {
      coreFeatures: [
        "User authentication",
        "Task management",
        "Automated workflows",
        "Basic reporting"
      ],
      developmentPhases: [
        {
          phase: "Phase 1 - Foundation",
          duration: "6 weeks",
          deliverables: ["Core authentication", "Basic task management"]
        },
        {
          phase: "Phase 2 - Core Features",
          duration: "8 weeks",
          deliverables: ["Workflow automation", "Reporting dashboard"]
        }
      ],
      technicalRequirements: [
        "Node.js backend",
        "React frontend",
        "PostgreSQL database",
        "REST API architecture"
      ],
      timeline: {
        start: "Q2 2024",
        milestones: [
          {
            name: "MVP Launch",
            date: "Q3 2024"
          },
          {
            name: "Beta Release",
            date: "Q4 2024"
          }
        ],
        completion: "Q4 2024"
      }
    },
    competitiveAnalysis: {
      directCompetitors: [
        {
          name: "CompetitorA",
          strengths: ["Market presence", "Feature rich"],
          weaknesses: ["High price", "Complex UI"]
        },
        {
          name: "CompetitorB",
          strengths: ["Strong brand", "Large user base"],
          weaknesses: ["Limited customization", "Poor support"]
        }
      ],
      indirectCompetitors: [
        {
          name: "Alternative Solution",
          threat: "Low",
          opportunity: "Partnership potential"
        },
        {
          name: "Legacy Systems",
          threat: "Medium",
          opportunity: "Migration services"
        }
      ],
      marketPosition: "Mid-market solution with enterprise capabilities",
      competitiveAdvantage: [
        "Better price-to-value ratio",
        "Simpler user interface",
        "Faster implementation",
        "Superior customer support"
      ]
    },
    actionPlan: {
      immediateSteps: [
        {
          action: "Market validation",
          timeline: "2 weeks",
          resources: "Marketing team"
        },
        {
          action: "Technical prototype",
          timeline: "4 weeks",
          resources: "Development team"
        }
      ],
      resourceRequirements: {
        technical: ["Full-stack developer", "DevOps engineer", "QA specialist"],
        human: ["Project manager", "UX designer", "Product owner"],
        financial: ["Initial development budget", "Marketing budget", "Infrastructure costs"]
      },
      riskMitigation: [
        {
          risk: "Technical complexity",
          impact: "High",
          mitigation: "Start with core features, add complexity gradually"
        },
        {
          risk: "Market adoption",
          impact: "Medium",
          mitigation: "Early adopter program and feedback loop"
        }
      ],
      successMetrics: [
        {
          metric: "User Adoption",
          target: "1000 users",
          timeline: "6 months"
        },
        {
          metric: "Customer Satisfaction",
          target: "85% satisfaction rate",
          timeline: "3 months"
        }
      ]
    }
  };
}
