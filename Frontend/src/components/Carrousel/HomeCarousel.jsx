import { useState, useEffect } from "react";
import "./Carrousel.css";

const slides = [
  {
    id: 1,
    title: "Nouveautés high‑tech",
    subtitle: "Découvrez les derniers smartphones et accessoires",
    cta: "Voir les produits",
    ctaLink: "/products",
    bg: "linear-gradient(135deg, #0f172a, #1d4ed8)",
  },
  {
    id: 2,
    title: "Offres limitées",
    subtitle: "Des réductions exclusives sur une sélection premium",
    cta: "Profiter des offres",
    ctaLink: "/products",
    bg: "linear-gradient(135deg, #0f172a, #be185d)",
  },
  {
    id: 3,
    title: "Livraison rapide",
    subtitle: "Chez vous en 24/48h sur une sélection d’articles",
    cta: "En savoir plus",
    ctaLink: "/products",
    bg: "linear-gradient(135deg, #0f172a, #16a34a)",
  },
];

export default function HomeCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // 4s

    return () => clearInterval(interval);
  }, [index]);

  const current = slides[index];

  return (
    <div className="home-carousel">
      <div
        className="home-carousel-slide"
        style={{ backgroundImage: current.bg }}
      >
        <div className="home-carousel-content">
          <h2>{current.title}</h2>
          <p>{current.subtitle}</p>
          <a href={current.ctaLink} className="home-carousel-cta">
            {current.cta}
          </a>
        </div>

        <button className="home-carousel-arrow left" onClick={prev}>
          ‹
        </button>
        <button className="home-carousel-arrow right" onClick={next}>
          ›
        </button>

        <div className="home-carousel-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={
                "home-carousel-dot" + (i === index ? " active" : "")
              }
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
