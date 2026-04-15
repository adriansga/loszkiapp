import { getCurrentUser } from './supabase-server';

// Admin — identyfikowany przez email w ADMIN_EMAILS (comma-separated w env)
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user?.email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? 'awielochapv@gmail.com')
    .split(',')
    .map(s => s.trim().toLowerCase());
  return admins.includes(user.email.toLowerCase());
}
