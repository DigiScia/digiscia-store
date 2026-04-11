// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000"; // adapte si besoin

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Nom d'utilisateur obligatoire.";
    }

    if (!form.password) {
      newErrors.password = "Mot de passe obligatoire.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setServerError("");

      const res = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.detail || "Nom d'utilisateur ou mot de passe invalide."
        );
        return;
      }

      // login_view renvoie aussi access + refresh + username + email
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);

      navigate("/"); // ou /Compte
    } catch (err) {
      console.error(err);
      setServerError("Erreur réseau, réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Connexion</h1>

        {serverError && <p className="auth-error">{serverError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username" className="auth-label">
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={`auth-input ${
                errors.username ? "auth-input-error" : ""
              }`}
            />
            {errors.username && (
              <p className="auth-field-error">{errors.username}</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`auth-input ${
                errors.password ? "auth-input-error" : ""
              }`}
            />
            {errors.password && (
              <p className="auth-field-error">{errors.password}</p>
            )}
          </div>

          <button type="submit" disabled={submitting} className="auth-submit">
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer-text">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="auth-footer-link">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
