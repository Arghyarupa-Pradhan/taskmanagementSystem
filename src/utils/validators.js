export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  return errors;
}

export function validateTask({ title, dueDate }) {
  const errors = {};
  if (!title || !title.trim()) errors.title = "Title is required.";
  if (dueDate) {
    const date = new Date(dueDate);
    if (Number.isNaN(date.getTime())) errors.dueDate = "Enter a valid date.";
  }
  return errors;
}

export function validateProject({ name }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = "Project name is required.";
  return errors;
}
