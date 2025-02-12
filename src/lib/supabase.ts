// This file is now minimal since we're not using Supabase
export function generateSessionId() {
  return crypto.randomUUID();
}

export async function createTempUser() {
  return {
    id: crypto.randomUUID(),
    session_id: generateSessionId()
  };
}
