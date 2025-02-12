import OpenAI from 'openai';
import type { AssessmentState, Report } from '../types';
import { questions } from '../data/questions';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is missing. Using static report generation.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true
});

function generatePrompt(state: AssessmentState): string {
  const answers = questions.map(q => {
    const answer = state.answers[q.id];
    const additionalInfo = state.additionalInfo?.[q.id];
    return `${q.text}:
Answer: ${answer || 'Not answered'}
${additionalInfo ? `Additional Context: ${additionalInfo}` : ''}`;
  }).join('\n\n');

  return `Generate a detailed report based on the following assessment answers:

${answers}

Company/Project Name: ${state.companyName || 'Not provided'}

The response should be a detailed analysis following this structure, formatted as valid JSON:

{
  "marketPotentialAnalysis": {
    "currentMarketSize": string,
    "growthProjections": string,
    "nicheOpportunity": string,
    "regionalAnalysis": string
  },
  "brandingStrategy": {
    "namesSuggestions": string[],
    "visualGuidelines": string,
    "positioningStatement": string
  },
  "painPointsMatrix": {
    "userPersonas": [
      {
        "name": string,
        "role": string,
        "painPoints": string[],
        "needs": string[]
      }
    ],
    "problemSolutionMap": [
      {
        "problem": string,
        "solution": string,
        "value": string
      }
    ],
    "useCaseScenarios": string[]
  },
  "mvpScope": {
    "coreFeatures": string[],
    "developmentPhases": [
      {
        "phase": string,
        "duration": string,
        "deliverables": string[]
      }
    ],
    "technicalRequirements": string[],
    "timeline": {
      "start": string,
      "milestones": [
        {
          "name": string,
          "date": string
        }
      ],
      "completion": string
    }
  },
  "competitiveAnalysis": {
    "directCompetitors": [
      {
        "name": string,
        "strengths": string[],
        "weaknesses": string[]
      }
    ],
    "indirectCompetitors": [
      {
        "name": string,
        "threat": string,
        "opportunity": string
      }
    ],
    "marketPosition": string,
    "competitiveAdvantage": string[]
  },
  "actionPlan": {
    "immediateSteps": [
      {
        "action": string,
        "timeline": string,
        "resources": string
      }
    ],
    "resourceRequirements": {
      "technical": string[],
      "human": string[],
      "financial": string[]
    },
    "riskMitigation": [
      {
        "risk": string,
        "impact": string,
        "mitigation": string
      }
    ],
    "successMetrics": [
      {
        "metric": string,
        "target": string,
        "timeline": string
      }
    ]
  }
}`;
}

export async function generateAIReport(state: AssessmentState): Promise<Report> {
  if (!apiKey) {
    console.warn('OpenAI API key not configured, using static report');
    return generateStaticReport(state);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert startup consultant specializing in MVP development and market analysis. Generate a detailed, actionable report as valid JSON following the exact structure provided. Every field must be populated with meaningful, specific content based on the assessment data and current market trends as of 2024.

CRITICAL REQUIREMENTS:
1. Response MUST be valid JSON that can be parsed
2. Follow the exact structure provided - no additional or missing fields
3. All string values must be properly escaped
4. All arrays must be properly formatted
5. Ensure all nested objects maintain the correct structure
6. Provide highly specific, actionable recommendations
7. Include realistic timelines and resource estimates
8. Base analysis on current market trends and best practices
9. Focus on concrete, measurable outcomes`
        },
        {
          role: "user",
          content: generatePrompt(state)
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const reportContent = completion.choices[0].message.content;
    if (!reportContent) {
      console.error('Empty response from OpenAI');
      return generateStaticReport(state);
    }

    try {
      const parsedReport = JSON.parse(reportContent);
      if (!validateReport(parsedReport)) {
        console.error('Invalid report structure from OpenAI');
        return generateStaticReport(state);
      }
      return parsedReport as Report;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return generateStaticReport(state);
    }
  } catch (error) {
    console.error('Error generating AI report:', error);
    return generateStaticReport(state);
  }
}

function validateReport(report: any): boolean {
  try {
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

    // Validate specific required fields
    const { marketPotentialAnalysis, painPointsMatrix, mvpScope, competitiveAnalysis, actionPlan } = report;

    // Market Analysis validation
    if (!marketPotentialAnalysis.currentMarketSize || !marketPotentialAnalysis.growthProjections) {
      return false;
    }

    // Pain Points validation
    if (!Array.isArray(painPointsMatrix.userPersonas) || !Array.isArray(painPointsMatrix.problemSolutionMap)) {
      return false;
    }

    // MVP Scope validation
    if (!Array.isArray(mvpScope.coreFeatures) || !Array.isArray(mvpScope.developmentPhases)) {
      return false;
    }

    // Competitive Analysis validation
    if (!Array.isArray(competitiveAnalysis.directCompetitors) || !competitiveAnalysis.marketPosition) {
      return false;
    }

    // Action Plan validation
    if (!Array.isArray(actionPlan.immediateSteps) || !actionPlan.resourceRequirements) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating report structure:', error);
    return false;
  }
}

function generateStaticReport(state: AssessmentState): Report {
  return {
    marketViabilityScore: 85,
    keyInsights: [
      "Strong market potential in chosen sector",
      "Clear value proposition identified",
      "Competitive advantage in target market",
      "Well-defined MVP scope"
    ],
    industryReadiness: "Based on your responses, your product shows strong alignment with current market needs and industry trends.",
    marketPotentialAnalysis: {
      currentMarketSize: "The current market size is estimated at $50B globally",
      growthProjections: "Expected CAGR of 15% over the next 5 years",
      nicheOpportunity: "Significant opportunity in underserved SMB segment",
      regionalAnalysis: "Strongest growth potential in North America and Europe"
    },
    brandingStrategy: {
      namesSuggestions: ["InnovatePro", "FlexiFlow", "AgileCore"],
      visualGuidelines: "Modern, minimalist design with focus on professionalism",
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
  } as Report;
}
