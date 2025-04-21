/**
 * Utility functions for managing the access token.
 * Provides in-memory caching for fast access and optional
 * persistence using localStorage.
 *
 * Used for setting, retrieving, and clearing JWT tokens
 * for authenticated API requests.
 */
let _accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  _accessToken = token;
  localStorage.setItem('accessToken', token); 
};

export const getAccessToken = () => {
  return _accessToken || localStorage.getItem('accessToken');
};

export const clearAccessToken = () => {
  _accessToken = null;
  localStorage.removeItem('accessToken');
};