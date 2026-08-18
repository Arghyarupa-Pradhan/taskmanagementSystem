import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { requestPasswordReset } from "../../services/authService";
import { isValidEmail } from "../../utils/validators";
import { ROUTES } from "../../constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
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
        <h1>Reset your password</h1>
        <p className="auth-card__subtitle">
          Enter your email and we'll send a link to reset your password.
        </p>

        {sent ? (
          <div className="auth-card__success">
            <p>Check your inbox for a reset link.</p>
            <Link to={ROUTES.LOGIN}>Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
              {error && <span className="field__error">{error}</span>}
            </label>

            <Button type="submit" disabled={submitting} className="auth-card__submit">
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="auth-card__row auth-card__row--center">
          <Link to={ROUTES.LOGIN}>Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
