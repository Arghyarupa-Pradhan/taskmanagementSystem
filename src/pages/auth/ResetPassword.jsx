import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { resetPassword } from "../../services/authService";
import { ROUTES } from "../../constants";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await resetPassword();
      navigate(ROUTES.LOGIN, { replace: true });
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
        <h1>Set a new password</h1>
        <p className="auth-card__subtitle">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="field__error field__error--form">{error}</p>}

          <Button type="submit" disabled={submitting} className="auth-card__submit">
            {submitting ? "Saving…" : "Save new password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
