import { useState } from 'react';
import type { AssessmentState } from '../types';

const getInitialState = (): AssessmentState => ({
  currentQuestion: 1,
  answers: {},
  additionalInfo: {},
  sessionStartedAt: new Date().toISOString()
});

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(getInitialState());
  const [userId] = useState<string | null>(crypto.randomUUID());
  const [sessionId] = useState<string | null>(crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    state,
    setState,
    userId,
    sessionId,
    isLoading,
    error
  };
}
