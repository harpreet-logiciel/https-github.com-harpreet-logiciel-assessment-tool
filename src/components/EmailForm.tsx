import React, { useState } from 'react';
import { Mail, User, Building2, X } from 'lucide-react';
import { Button } from './Button';
import { convertAnonymousUser } from '../services/reports';
import type { AssessmentState } from '../types';

interface EmailFormProps {
  state: AssessmentState;
  userId: string;
  reportId: string;
  onCancel: () => void;
}

export function EmailForm({ state, userId, reportId, onCancel }: EmailFormProps) {
  const [formState, setFormState] = useState({
    email: state.email || '',
    name: state.name || '',
    companyName: state.companyName || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formState.email) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert anonymous user to registered user
      await convertAnonymousUser(userId, {
        email: formState.email,
        name: formState.name,
        companyName: formState.companyName
      });

      // Reload the page to show full report
      window.location.reload();
    } catch (err) {
      console.error('Error processing request:', err);
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Get Your Full Report
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company/Project Name (Optional)
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formState.companyName}
                onChange={(e) => setFormState(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Acme Inc"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-lg"
            >
              {isSubmitting ? 'Processing...' : 'View Full Report'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="w-full py-4 text-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
