# Build an MVP Assessment Application

## Overview
Create a modern web application that helps entrepreneurs evaluate their MVP (Minimum Viable Product) readiness through an interactive assessment process. The application should provide AI-powered insights and actionable recommendations within minutes.

## Core Features

### 1. Landing Page
- Clean, professional design with clear value proposition
- Highlight key benefits:
  - Quick assessment (10 minutes)
  - No registration required
  - Free basic insights
  - AI-powered recommendations
- Clear call-to-action to start assessment
- Responsive design for all devices

### 2. Assessment Flow
Create an intuitive questionnaire with:

- 9 key questions covering:
  1. Startup Stage (idea/wireframe/MVP)
  2. Industry Focus
  3. Target Market
  4. Geographical Focus
  5. Competition Analysis
  6. Pain Points
  7. Value Metrics
  8. Branding Status
  9. Timeline & Resources

- Question Types:
  - Single select
  - Multi-select
  - Radio buttons with optional text input
  - Free text for additional context

- Features:
  - Progress indicator
  - Previous/Next navigation
  - Answer validation
  - Session persistence
  - Mobile-friendly interface

### 3. Report Generation
Implement two-tier reporting:

#### Preview Report (Free)
- Market Viability Score
- 3-4 Key Insights
- Industry Readiness Summary
- Basic Market Analysis

#### Full Report (Email-gated)
- Comprehensive Market Analysis
  - Current market size
  - Growth projections
  - Niche opportunities
  - Regional analysis

- Branding Strategy
  - Name suggestions
  - Visual guidelines
  - Positioning statement

- Pain Points Matrix
  - User personas
  - Problem-solution mapping
  - Use case scenarios

- MVP Scope Definition
  - Core features
  - Development phases
  - Technical requirements
  - Timeline with milestones

- Competitive Analysis
  - Direct competitors
  - Indirect competitors
  - Market position
  - Competitive advantages

- Action Plan
  - Immediate steps
  - Resource requirements
  - Risk mitigation
  - Success metrics

### 4. Technical Requirements

#### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Responsive design
- Form validation
- Progress persistence
- Share functionality

#### Backend
- Supabase for:
  - Database
  - Authentication
  - Row Level Security
- OpenAI integration for report generation
- Email capture system

#### Security
- Anonymous sessions
- Data encryption
- Secure API endpoints
- Rate limiting

## User Experience Guidelines

### Design Principles
- Clean, professional aesthetic
- Clear visual hierarchy
- Consistent branding
- Intuitive navigation
- Responsive feedback
- Loading states
- Error handling

### Accessibility
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

## Success Metrics
Track:
- Assessment completion rate
- Email conversion rate
- Report generation success
- User engagement time
- Share rate
- Return visitor rate

## Development Phases

### Phase 1: Foundation
- Project setup
- UI components
- Assessment flow
- Basic report generation

### Phase 2: AI Integration
- OpenAI integration
- Report templates
- Analysis algorithms
- Fallback mechanisms

### Phase 3: User Experience
- Email capture
- Share functionality
- Progress persistence
- Mobile optimization

### Phase 4: Polish
- Performance optimization
- Error handling
- Analytics
- Documentation

## Technical Stack

### Required Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "openai": "^4.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x"
  }
}
```

## Deployment
- Configure for Netlify deployment
- Set up environment variables
- Enable preview deployments
- Configure build settings

## Future Enhancements
Consider:
- Custom branding options
- Team collaboration
- Report comparison
- Industry benchmarks
- API integration
- Export capabilities
