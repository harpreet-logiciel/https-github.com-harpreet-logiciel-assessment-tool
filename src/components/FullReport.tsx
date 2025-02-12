import React from 'react';
import { FileText, BarChart2, Cpu, AlertTriangle, Lightbulb, Users, Target, Activity } from 'lucide-react';
import type { Report } from '../types';

interface FullReportProps {
  report: Report;
}

export function FullReport({ report }: FullReportProps) {
  // Safely destructure all required sections with null checks
  const {
    marketPotentialAnalysis,
    brandingStrategy,
    painPointsMatrix,
    mvpScope,
    competitiveAnalysis,
    actionPlan
  } = report;

  // Additional safety check for required sections
  if (!marketPotentialAnalysis || !painPointsMatrix || !mvpScope || !competitiveAnalysis || !actionPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Report data is incomplete. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">MVP Assessment Report</h1>
        <p className="text-blue-100">Prepared for {report.name || report.email}</p>
        {report.companyName && (
          <p className="text-blue-100">Project: {report.companyName}</p>
        )}
      </div>

      {/* Market Potential Analysis */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Market Potential Analysis</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Current Market Size</h3>
            <p className="text-gray-700">{marketPotentialAnalysis.currentMarketSize}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Growth Projections</h3>
            <p className="text-gray-700">{marketPotentialAnalysis.growthProjections}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Niche Opportunity</h3>
            <p className="text-gray-700">{marketPotentialAnalysis.nicheOpportunity}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Regional Analysis</h3>
            <p className="text-gray-700">{marketPotentialAnalysis.regionalAnalysis}</p>
          </div>
        </div>
      </section>

      {/* Branding Strategy (if available) */}
      {brandingStrategy && (
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold">Branding Strategy</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Suggested Names</h3>
              <ul className="list-disc list-inside space-y-1">
                {brandingStrategy.namesSuggestions.map((name, index) => (
                  <li key={index} className="text-gray-700">{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Visual Guidelines</h3>
              <p className="text-gray-700">{brandingStrategy.visualGuidelines}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Positioning Statement</h3>
              <p className="text-gray-700">{brandingStrategy.positioningStatement}</p>
            </div>
          </div>
        </section>
      )}

      {/* Pain Points & Solutions Matrix */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold">Pain Points & Solutions Matrix</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">User Personas</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {painPointsMatrix.userPersonas.map((persona, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{persona.name} - {persona.role}</h4>
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600">Pain Points:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {persona.painPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600">Needs:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {persona.needs.map((need, idx) => (
                          <li key={idx}>{need}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Problem-Solution Mapping</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Problem</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Solution</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {painPointsMatrix.problemSolutionMap.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-700">{item.problem}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{item.solution}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Use Case Scenarios</h3>
            <ul className="space-y-2">
              {painPointsMatrix.useCaseScenarios.map((scenario, index) => (
                <li key={index} className="text-gray-700">
                  {scenario}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MVP Scope Definition */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold">MVP Scope Definition</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Core Features</h3>
            <ul className="list-disc list-inside space-y-1">
              {mvpScope.coreFeatures.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Development Phases</h3>
            <div className="space-y-4">
              {mvpScope.developmentPhases.map((phase, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{phase.phase} ({phase.duration})</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {phase.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="text-gray-700">{deliverable}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Technical Requirements</h3>
            <ul className="list-disc list-inside space-y-1">
              {mvpScope.technicalRequirements.map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm mb-2">
                <span className="font-medium">Start:</span> {mvpScope.timeline.start}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Milestones:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {mvpScope.timeline.milestones.map((milestone, index) => (
                    <li key={index} className="text-gray-700">
                      {milestone.name}: {milestone.date}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm mt-2">
                <span className="font-medium">Completion:</span> {mvpScope.timeline.completion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Analysis */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-semibold">Competitive Analysis</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Direct Competitors</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {competitiveAnalysis.directCompetitors.map((competitor, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{competitor.name}</h4>
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600">Strengths:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {competitor.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600">Weaknesses:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {competitor.weaknesses.map((weakness, idx) => (
                          <li key={idx}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Indirect Competitors</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {competitiveAnalysis.indirectCompetitors.map((competitor, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{competitor.name}</h4>
                  <p className="text-sm mb-2">
                    <span className="font-medium">Threat:</span> {competitor.threat}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Opportunity:</span> {competitor.opportunity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Market Position</h3>
            <p className="text-gray-700">{competitiveAnalysis.marketPosition}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Competitive Advantages</h3>
            <ul className="list-disc list-inside space-y-1">
              {competitiveAnalysis.competitiveAdvantage.map((advantage, index) => (
                <li key={index} className="text-gray-700">{advantage}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Action Plan */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-semibold">Action Plan</h2>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Immediate Steps</h3>
            <div className="space-y-3">
              {actionPlan.immediateSteps.map((step, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{step.action}</h4>
                  <p className="text-sm">
                    <span className="font-medium">Timeline:</span> {step.timeline}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Resources:</span> {step.resources}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Resource Requirements</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Technical</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {actionPlan.resourceRequirements.technical.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Human</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {actionPlan.resourceRequirements.human.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Financial</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {actionPlan.resourceRequirements.financial.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Risk Mitigation</h3>
            <div className="space-y-3">
              {actionPlan.riskMitigation.map((risk, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">{risk.risk}</h4>
                  <p className="text-sm">
                    <span className="font-medium">Impact:</span> {risk.impact}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Mitigation:</span> {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Success Metrics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Metric</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Target</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {actionPlan.successMetrics.map((metric, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-700">{metric.metric}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{metric.target}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{metric.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
