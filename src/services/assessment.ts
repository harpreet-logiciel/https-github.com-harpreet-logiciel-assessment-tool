import { supabase } from '../lib/supabase';
import type { AssessmentState } from '../types';

interface Answer {
  questionId: number;
  value: string | string[];
}

interface QueuedSync {
  userId: string;
  answers: Answer[];
  attempts: number;
  timestamp: number;
}

let syncTimeout: NodeJS.Timeout | null = null;
let pendingAnswers: Answer[] = [];
let syncQueue: QueuedSync[] = [];
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds
const SYNC_BATCH_SIZE = 3;
const SYNC_INTERVAL = 30000; // 30 seconds

// Load queued syncs from localStorage
function loadSyncQueue() {
  try {
    const saved = localStorage.getItem('assessment-sync-queue');
    if (saved) {
      syncQueue = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading sync queue:', error);
    syncQueue = [];
  }
}

// Save sync queue to localStorage
function saveSyncQueue() {
  try {
    localStorage.setItem('assessment-sync-queue', JSON.stringify(syncQueue));
  } catch (error) {
    console.error('Error saving sync queue:', error);
  }
}

// Initialize queue from localStorage
loadSyncQueue();

// Verify session is still valid
async function verifySession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

// Create a new session
async function createNewSession() {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const email = `temp_${timestamp}_${randomString}@assessment.local`;
    const password = `temp_${timestamp}_${randomString}`;

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          is_anonymous: true
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!user) throw new Error('No user returned from sign up');

    return user;
  } catch (error) {
    console.error('Error creating new session:', error);
    throw error;
  }
}

export async function createTemporaryUser() {
  try {
    // First check if we already have a session
    const session = await verifySession();
    if (session?.user) {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!fetchError && existingUser) {
        return existingUser;
      }
    }

    // Create new user and session
    const user = await createNewSession();

    // Create user record
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        is_anonymous: true,
        session_id: user.id,
        email: user.email
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    if (!data) throw new Error('No data returned from user insert');

    return data;
  } catch (error) {
    console.error('Error creating temporary user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: {
  email?: string;
  name?: string;
  company?: string;
  is_anonymous?: boolean;
}) {
  try {
    const session = await verifySession();
    if (!session) {
      const user = await createNewSession();
      if (!user) throw new Error('Failed to create new session');
    }

    const { error } = await supabase
      .from('users')
      .update({
        ...userData,
        is_anonymous: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function processQueue() {
  if (syncQueue.length === 0) return;

  const now = Date.now();
  const item = syncQueue[0];

  if (now - item.timestamp < RETRY_DELAY) return;

  try {
    // Ensure we have a valid session
    const session = await verifySession();
    if (!session) {
      await createNewSession();
    }

    await syncAnswers(item.userId, item.answers);
    
    // Only remove from queue if sync was successful
    syncQueue.shift();
    saveSyncQueue();
  } catch (error) {
    console.error('Error processing queue item:', error);
    
    // Increment attempts and update timestamp
    item.attempts++;
    item.timestamp = now;

    if (item.attempts >= MAX_RETRY_ATTEMPTS) {
      console.warn('Max retry attempts reached for sync:', item);
      syncQueue.shift();
      saveSyncQueue();
    }
  }
}

// Start queue processor
const queueProcessor = setInterval(processQueue, RETRY_DELAY);

// Cleanup on window unload
window.addEventListener('unload', () => {
  clearInterval(queueProcessor);
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
});

export async function syncAnswers(userId: string, answers: Answer[]) {
  if (!userId || !answers?.length) {
    console.warn('Invalid sync request:', { userId, answers });
    return;
  }

  if (!navigator.onLine) {
    throw new Error('Offline');
  }

  try {
    // Ensure we have a valid session
    const session = await verifySession();
    if (!session) {
      await createNewSession();
    }

    const { error: upsertError } = await supabase
      .from('assessment_answers')
      .upsert(
        answers.map(answer => ({
          user_id: userId,
          question_id: answer.questionId.toString(),
          answer: answer.value
        })),
        { 
          onConflict: 'user_id,question_id',
          ignoreDuplicates: false
        }
      );

    if (upsertError) throw upsertError;

    // Clear pending answers only on successful sync
    pendingAnswers = pendingAnswers.filter(
      pending => !answers.some(
        answer => answer.questionId === pending.questionId
      )
    );
  } catch (error) {
    console.error('Error syncing answers:', error);
    
    // Queue for retry if we have a session error or network error
    if (error.message === 'No active session' || error.message === 'Offline') {
      const existingQueueItem = syncQueue.find(
        item => item.userId === userId &&
        item.answers.some(a => answers.some(b => b.questionId === a.questionId))
      );

      if (!existingQueueItem) {
        syncQueue.push({
          userId,
          answers,
          attempts: 0,
          timestamp: Date.now()
        });
        saveSyncQueue();
      }
    }
    
    throw error;
  }
}

export function queueAnswerSync(userId: string | null, answer: Answer) {
  if (!userId || !answer) {
    console.warn('Invalid sync request:', { userId, answer });
    return;
  }

  // Remove any existing pending answers for the same question
  pendingAnswers = pendingAnswers.filter(
    pending => pending.questionId !== answer.questionId
  );

  pendingAnswers.push(answer);

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Immediate sync if we have enough answers
  if (pendingAnswers.length >= SYNC_BATCH_SIZE) {
    syncAnswers(userId, [...pendingAnswers]).catch(error => {
      console.error('Batch sync failed:', error);
      
      // Queue failed batch for retry
      if (!syncQueue.some(item => item.userId === userId)) {
        syncQueue.push({
          userId,
          answers: [...pendingAnswers],
          attempts: 0,
          timestamp: Date.now()
        });
        saveSyncQueue();
      }
    });
  } else {
    // Schedule delayed sync
    syncTimeout = setTimeout(() => {
      if (pendingAnswers.length > 0) {
        syncAnswers(userId, [...pendingAnswers]).catch(error => {
          console.error('Delayed sync failed:', error);
          
          // Queue failed sync for retry
          if (!syncQueue.some(item => item.userId === userId)) {
            syncQueue.push({
              userId,
              answers: [...pendingAnswers],
              attempts: 0,
              timestamp: Date.now()
            });
            saveSyncQueue();
          }
        });
      }
    }, SYNC_INTERVAL);
  }
}

export async function saveReports(userId: string, previewReport: any, fullReport: any) {
  if (!userId) {
    console.warn('No user ID provided for report save');
    return;
  }

  try {
    // Ensure we have a valid session
    const session = await verifySession();
    if (!session) {
      await createNewSession();
    }

    const { error } = await supabase
      .from('reports')
      .insert([{
        user_id: userId,
        preview_report: previewReport,
        full_report: fullReport
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving reports:', error);
    throw error;
  }
}

export async function getReports(userId: string) {
  if (!userId) {
    console.warn('No user ID provided for report retrieval');
    return null;
  }

  try {
    // Ensure we have a valid session
    const session = await verifySession();
    if (!session) {
      await createNewSession();
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting reports:', error);
    throw error;
  }
}
