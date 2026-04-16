import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, MapPin, Map, Phone, ArrowRight, Zap, Globe } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

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
    if (!form.username.trim()) newErrors.username = "Requis.";
    if (!form.email.trim()) newErrors.email = "Requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalide.";
    if (!form.password) newErrors.password = "Requis.";
    else if (form.password.length < 8) newErrors.password = "8+ car.";
    if (!form.first_name.trim()) newErrors.first_name = "Requis.";
    if (!form.last_name.trim()) newErrors.last_name = "Requis.";
    if (!form.city.trim()) newErrors.city = "Requis.";
    if (!form.adress.trim()) newErrors.adress = "Requis.";
    if (!form.phone_number.trim()) newErrors.phone_number = "Requis.";
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
      const res = await fetch(`${API_BASE_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.detail || Object.values(data)[0][0] || "Échec de l'initialisation.");
        return;
      }
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      navigate("/");
    } catch (err) {
      setServerError("Connexion perdue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05) 0%, transparent 50%)' }}>
      <div className="auth-card animate-slide-up" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Visual Panel */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
           <div className="logo-icon glass" style={{ width: '60px', height: '60px', background: 'var(--primary)', marginBottom: '3rem' }}>
             <Zap size={32} fill="currentColor" />
           </div>
           <h1 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 950 }}>Rejoignez <br /> le Future. <br /> <span className="text-secondary">Maintenant.</span></h1>
           <p style={{ opacity: 0.5, lineHeight: 1.8, fontSize: '0.9rem' }}>Devenez membre de la première destination technologique d'élite. Accédez à des collections réservées.</p>
           
           <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Globe className="text-accent" size={18} />
                <span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accès Global Arctique</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Zap className="text-primary" size={18} />
                <span style={{ fontSize: '0.75rem', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vitesse de Commande Alpha</span>
              </div>
           </div>
        </div>

        {/* Form Panel */}
        <div style={{ padding: '4rem', overflowY: 'auto', maxHeight: '85vh' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Création de Compte</h2>
            <p style={{ opacity: 0.4, fontSize: '0.9rem' }}>Configurez votre profil d'élite.</p>
          </div>

          {serverError && <p className="auth-error" style={{ marginBottom: '2rem' }}>{serverError}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div className="auth-field">
                <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Nom d'utilisateur</label>
                <input name="username" type="text" value={form.username} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} placeholder="nom_unique" />
                {errors.username && <p className="auth-field-error" style={{ marginTop: '0.4rem', fontSize: '0.6rem' }}>{errors.username}</p>}
              </div>
              <div className="auth-field">
                <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} placeholder="votre@email.com" />
                {errors.email && <p className="auth-field-error" style={{ marginTop: '0.4rem', fontSize: '0.6rem' }}>{errors.email}</p>}
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: '2rem' }}>
              <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Clé d'Accès</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} placeholder="••••••••••••" />
              {errors.password && <p className="auth-field-error" style={{ marginTop: '0.4rem', fontSize: '0.6rem' }}>{errors.password}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
               <div className="auth-field">
                <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Prénom</label>
                <input name="first_name" type="text" value={form.first_name} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} />
              </div>
              <div className="auth-field">
                <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Nom</label>
                <input name="last_name" type="text" value={form.last_name} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '2rem' }}>
               <div className="auth-field">
                <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Ville</label>
                <input name="city" type="text" value={form.city} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} />
              </div>
              <div className="auth-field">
                <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Localisation Exacte</label>
                <input name="adress" type="text" value={form.adress} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} />
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: '3rem' }}>
              <label className="auth-label" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.3, fontSize: '0.7rem' }}>Terminal Mobile</label>
              <input name="phone_number" type="tel" value={form.phone_number} onChange={handleChange} className="auth-input" style={{ background: 'transparent', borderRadius: 0, border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }} placeholder="+237 ..." />
            </div>

            <button type="submit" disabled={submitting} className="auth-submit" style={{ borderRadius: '100px', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {submitting ? "Initialisation..." : "Créer l'Identité Digitale"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-footer-text" style={{ marginTop: '3rem', opacity: 0.5, textAlign: 'center' }}>
            Déjà authentifié ?{" "}
            <Link to="/login" className="auth-footer-link" style={{ color: 'white', textDecoration: 'underline' }}>Reprendre l'accès</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


