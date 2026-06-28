// DEVELOPMENT AUTH BYPASS CONFIGURATION
// Set to true to bypass authentication, skip login/signup screens, and simulate a mock user in memory.
// Set to false to restore standard JWT/authentication flows.
export const DEV_BYPASS_AUTH = true;

// Mock User details returned when bypass is active
export const MOCK_USER = {
  userId: 'mock-dev-user-id-999',
  username: 'DevAthlete',
  email: 'dev@vitalis.fit',
  experienceLevel: 'intermediate',
  goal: 'muscle_gain'
};

// Mock Token returned when bypass is active
export const MOCK_TOKEN = 'mock-dev-jwt-token-999';
