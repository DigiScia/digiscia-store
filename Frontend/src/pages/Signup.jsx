// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Signup.css";

const API_BASE_URL = "http://127.0.0.1:8000"; // adapte si besoin

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    city: "",
    adress: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Nom d'utilisateur obligatoire.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email obligatoire.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Email invalide.";
      }
    }

    if (!form.password) {
      newErrors.password = "Mot de passe obligatoire.";
    } else if (form.password.length < 8) {
      newErrors.password = "Au moins 8 caractères.";
    }

    if (!form.first_name.trim()) {
      newErrors.first_name = "Prénom obligatoire.";
    }
    if (!form.last_name.trim()) {
      newErrors.last_name = "Nom obligatoire.";
    }
    if (!form.city.trim()) {
      newErrors.city = "Ville obligatoire.";
    }
    if (!form.adress.trim()) {
      newErrors.adress = "adress obligatoire.";
    }
    if (!form.phone_number.trim()) {
      newErrors.phone_number = "Numéro de téléphone obligatoire.";
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

      setSubmitting(true);
      setServerError("");

      try {
        const res = await fetch("http://127.0.0.1:8000/signup/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            email: form.email,
            password: form.password,
            first_name: form.first_name,
            last_name: form.last_name,
            city: form.city,
            adress: form.adress,
            phone_number: form.phone_number,
          }),
        });

        const data = await res.json();
        console.log("status signup =>", res.status);
        console.log("data signup =>", data);

        if (!res.ok) {
          const firstError =
            data.detail ||
            (Object.values(data)[0] && Object.values(data)[0][0]) ||
            "Erreur lors de l'inscription.";
          setServerError(firstError);
          return;
        }

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);

        navigate("/");
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
        <h1 className="auth-title">Créer un compte</h1>

        {serverError && <p className="auth-error">{serverError}</p>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
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

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`auth-input ${
                errors.email ? "auth-input-error" : ""
              }`}
            />
            {errors.email && (
              <p className="auth-field-error">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
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

          {/* Prénom */}
          <div className="auth-field">
            <label htmlFor="first_name" className="auth-label">
              Prénom
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              className={`auth-input ${
                errors.first_name ? "auth-input-error" : ""
              }`}
            />
            {errors.first_name && (
              <p className="auth-field-error">{errors.first_name}</p>
            )}
          </div>

          {/* Nom */}
          <div className="auth-field">
            <label htmlFor="last_name" className="auth-label">
              Nom
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              className={`auth-input ${
                errors.last_name ? "auth-input-error" : ""
              }`}
            />
            {errors.last_name && (
              <p className="auth-field-error">{errors.last_name}</p>
            )}
          </div>

          {/* Ville */}
          <div className="auth-field">
            <label htmlFor="city" className="auth-label">
              Ville
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              className={`auth-input ${
                errors.city ? "auth-input-error" : ""
              }`}
            />
            {errors.city && (
              <p className="auth-field-error">{errors.city}</p>
            )}
          </div>

          {/* adress */}
          <div className="auth-field">
            <label htmlFor="Adresse" className="auth-label">
              Adresse
            </label>
            <input
              id="adress"
              name="adress"
              type="text"
              value={form.adress}
              onChange={handleChange}
              className={`auth-input ${
                errors.adress ? "auth-input-error" : ""
              }`}
            />
            {errors.adress && (
              <p className="auth-field-error">{errors.adress}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="auth-field">
            <label htmlFor="phone_number" className="auth-label">
              Numéro de téléphone
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              className={`auth-input ${
                errors.phone_number ? "auth-input-error" : ""
              }`}
            />
            {errors.phone_number && (
              <p className="auth-field-error">{errors.phone_number}</p>
            )}
          </div>

          <button type="submit" disabled={submitting} className="auth-submit">
            {submitting ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>

        <p className="auth-footer-text">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="auth-footer-link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
