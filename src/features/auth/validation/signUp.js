export function validateSignUp({ email, fullname, username, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email';

  if (!fullname?.trim()) errors.fullname = 'Full name is required';
  if (!username?.trim()) errors.username = 'Username is required';
  else if (!/^[a-zA-Z0-9._]{3,20}$/.test(username))
    errors.username = '3–20 chars: letters, digits, dot, underscore';

  if (!password?.trim()) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Min 6 characters';

  return errors;
}
