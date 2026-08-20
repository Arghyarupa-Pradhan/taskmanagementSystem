export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin({ email, password }) {
  const errors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function validateTask({
  employeeName,
  taskName,
  creationDate,
  time,
  note,
}) {
  const errors = {};

  if (!employeeName || !employeeName.trim()) {
    errors.employeeName = "Employee name is required.";
  }

  if (!taskName || !taskName.trim()) {
    errors.taskName = "Task name is required.";
  }

  if (!creationDate) {
    errors.creationDate = "Creation date is required.";
  } else {
    const date = new Date(creationDate);

    if (Number.isNaN(date.getTime())) {
      errors.creationDate = "Enter a valid date.";
    }
  }

  if (!time) {
    errors.time = "Time is required.";
  }

  if (note && !note.trim()) {
    errors.note = "Enter a valid note.";
  }

  return errors;
}

export function validateProject({ name }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Project name is required.";
  }

  return errors;
}