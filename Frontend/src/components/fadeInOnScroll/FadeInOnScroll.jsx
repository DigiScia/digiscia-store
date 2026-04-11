import { useEffect, useRef, useState } from "react";

export default function FadeInOnScroll({ children, className = "" }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 delay-300 ease-out transform ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-125"
      } ${className}`}
    >
      {children}
    </div>
  );
}