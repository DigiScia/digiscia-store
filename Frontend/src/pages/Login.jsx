import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight, Zap, ShieldCheck } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Identification requise.";
    if (!form.password) newErrors.password = "Clé d'accès requise.";
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
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.detail || "Paramètres d'accès invalides.");
        return;
      }
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      navigate("/");
    } catch (err) {
      setServerError("Connexion au serveur impossible.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: 'radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05) 0%, transparent 50%)' }}>
      <div className="auth-card animate-slide-up" style={{ maxWidth: '1000px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Visual Panel */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
           <div className="logo-icon glass" style={{ width: '60px', height: '60px', background: 'var(--primary)', marginBottom: '3rem' }}>
             <Zap size={32} fill="currentColor" />
           </div>
           <h1 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 900 }}>Accédez à <br /> l'Expérience <br /> <span className="text-accent">Digiscia.</span></h1>
           <p style={{ opacity: 0.5, lineHeight: 1.8, maxWidth: '300px' }}>Votre portail vers une technologie d'exception. Sécurisé, rapide, exclusif.</p>
           
           <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ShieldCheck className="text-secondary" size={20} />
              <span style={{ fontSize: '0.8rem', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Chiffrement End-to-End</span>
           </div>
        </div>

        {/* Form Panel */}
        <div style={{ padding: '4rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Connexion</h2>
            <p style={{ opacity: 0.4, fontSize: '0.9rem' }}>Identifiez-vous pour continuer.</p>
          </div>

          {serverError && <p className="auth-error" style={{ marginBottom: '2rem' }}>{serverError}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field" style={{ marginBottom: '2rem' }}>
              <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3 }}>Utilisateur</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }} />
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  className="auth-input"
                  style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0 1rem 2.5rem' }}
                  placeholder="votre_nom"
                />
              </div>
              {errors.username && <p className="auth-field-error" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>{errors.username}</p>}
            </div>

            <div className="auth-field" style={{ marginBottom: '3rem' }}>
              <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3 }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }} />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input"
                  style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0 1rem 2.5rem' }}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="auth-field-error" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>{errors.password}</p>}
            </div>

            <button type="submit" disabled={submitting} className="auth-submit" style={{ borderRadius: '100px', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {submitting ? "Vérification..." : "Entrer dans l'Espace"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-footer-text" style={{ marginTop: '3rem', opacity: 0.5 }}>
            Pas encore de compte ?{" "}
            <Link to="/signup" className="auth-footer-link" style={{ color: 'white', textDecoration: 'underline' }}>S'inscrire gratuitement</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


