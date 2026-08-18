import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../hooks";
import { validateLogin } from "../../utils/validators";
import { ROUTES } from "../../constants";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message || "Something went wrong. Try again.");
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
        <h1>Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to keep your work moving.</p>

        <form onSubmit={handleSubmit} noValidate>
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
            {errors.email && <span className="field__error">{errors.email}</span>}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <span className="field__error">{errors.password}</span>}
          </label>

          {serverError && <p className="field__error field__error--form">{serverError}</p>}

          <div className="auth-card__row">
            <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
          </div>

          <Button type="submit" disabled={submitting} className="auth-card__submit">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="auth-card__hint">
          This is a frontend-only demo — any email and a 6+ character password will sign you in.
        </p>
      </div>
    </div>
  );
}
