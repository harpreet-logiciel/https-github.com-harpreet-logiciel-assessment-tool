import type { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    text: "What stage is your startup in?",
    type: "single-select",
    options: [
      "Early Stage with just an idea",
      "Early Stage with some wireframing",
      "Early Stage with an already developed MVP"
    ]
  },
  {
    id: 2,
    text: "Industry/Domain Focus",
    type: "single-select",
    options: [
      "Healthcare (Medical Devices, Digital Health, Biotech)",
      "Education (EdTech, E-learning, Training)",
      "Real Estate (PropTech, Management, Investment)",
      "Fintech (Payments, Banking, Insurance)",
      "Retail/E-Commerce (B2C, B2B, Marketplaces)",
      "Entertainment/Media (Streaming, Gaming, Content)",
      "Other"
    ],
    showTextInput: true
  },
  {
    id: 3,
    text: "Target Users & Market",
    type: "multi-select",
    options: [
      "Small Businesses (1-50 employees, Budget: $1K-$10K/year)",
      "Enterprise Organizations (500+ employees, Budget: $50K+/year)",
      "Freelancers (Individual, Budget: $100-$1K/year)",
      "Individual Consumers (B2C, Various price points)",
      "Nonprofits (Limited budget, High impact)",
      "Other"
    ],
    showTextInput: true
  },
  {
    id: 4,
    text: "Geographical Focus",
    type: "multi-select",
    options: [
      "North America (Mature market, High competition)",
      "Europe (Diverse regulations, Growing market)",
      "APAC (Fast growth, Tech-savvy)",
      "Latin America (Emerging market, Mobile-first)",
      "Middle East/Africa (Developing market, Untapped potential)",
      "Global (Multi-region approach)"
    ]
  },
  {
    id: 5,
    text: "Competitor Analysis",
    type: "radio",
    options: ["Yes", "No"],
    showTextInput: true,
    placeholder: "Enter competitor names (one per line)"
  },
  {
    id: 6,
    text: "Primary Customer Pain Points",
    type: "multi-select",
    options: [
      "Lack of productivity (Time waste, Inefficient processes)",
      "High costs (Operational expenses, Resource allocation)",
      "Inefficient workflows (Manual tasks, Bottlenecks)",
      "Poor customer experience (Service quality, Support)",
      "Communication challenges (Internal/External)",
      "Other"
    ],
    showTextInput: true
  },
  {
    id: 7,
    text: "Value Creation Metrics",
    type: "multi-select",
    options: [
      "Time savings (20-40% improvement expected)",
      "Cost reduction (15-30% savings projected)",
      "Customer satisfaction improvement (30-50% increase)",
      "Other"
    ],
    showTextInput: true
  },
  {
    id: 8,
    text: "Product Branding Status",
    type: "radio",
    options: ["Yes", "No"],
    showTextInput: true,
    placeholder: "Enter product name"
  },
  {
    id: 9,
    text: "Launch Timeline & Resources",
    type: "single-select",
    options: [
      "1-3 months (Minimal viable team)",
      "3-6 months (Core team in place)",
      "6-12 months (Full team required)",
      "Flexible timeline (Resource dependent)",
      "Not sure (Need guidance)"
    ]
  }
];
