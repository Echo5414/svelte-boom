import { redirect } from '@sveltejs/kit';

export const load = ({ url }) => {
  const error = url.searchParams.get('error');
  
  if (error) {
    console.error('Login error:', error);
    // Optional: Handle different error types
  }
  
  // Redirect back to home
  throw redirect(303, '/');
}; 