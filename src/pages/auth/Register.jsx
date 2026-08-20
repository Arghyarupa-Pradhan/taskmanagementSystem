import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../hooks";
import { ROUTES } from "../../constants";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");

    try {
      await register(form);
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setServerError(
        err.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-card__brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>Taskline</span>
        </div>

        <h1>Create an account</h1>

        <p className="auth-card__subtitle">
          Sign up to start managing your tasks.
        </p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <label className="field">
            <span>Name</span>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
            />

            {errors.name && (
              <span className="field__error">
                {errors.name}
              </span>
            )}
          </label>

          {/* Email */}
          <label className="field">
            <span>Email</span>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
            />

            {errors.email && (
              <span className="field__error">
                {errors.email}
              </span>
            )}
          </label>

          {/* Password */}
          <label className="field">
            <span>Password</span>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {errors.password && (
              <span className="field__error">
                {errors.password}
              </span>
            )}
          </label>

          {/* Server error */}
          {serverError && (
            <p className="field__error field__error--form">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="auth-card__submit"
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="auth-card__hint">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN}>Sign in</Link>
        </p>

      </div>
    </div>
  );
}