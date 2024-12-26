// List of admin email addresses
const ADMIN_EMAILS = [
  'admin@mindfulai.com'  // Replace with your actual admin email
];

export const isAdmin = (user) => {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email);
}; 