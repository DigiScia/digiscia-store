import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface ScreenSplashProps {
  isLoading: boolean;
  message?: string;
  isInitial?: boolean;
}

const STEPS = [
  'Initialisation…',
  'Chargement des produits…',
  'Synchronisation…',
  'Prêt',
];

const ScreenSplash: React.FC<ScreenSplashProps> = ({
  isLoading,
  message,
  isInitial = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepVisible, setStepVisible] = useState(true);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 200, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setStepVisible(false);
      setTimeout(() => {
        setStepIndex(prev => {
          const next = prev + 1;
          if (next >= STEPS.length - 1) clearInterval(interval);
          return next < STEPS.length ? next : prev;
        });
        setStepVisible(true);
      }, 300);
    }, 900);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const W = containerRef.current.offsetWidth;
    const H = containerRef.current.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    type P = { x: number; y: number; r: number; vx: number; vy: number; o: number };
    const pts: P[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,210,255,${p.o})`;
        ctx.fill();
      });
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,210,255,${0.07 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [isLoading]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left - 3);
    mouseY.set(e.clientY - r.top - 3);
  };

  const currentStep = message ?? STEPS[stepIndex];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          onMouseMove={handleMouseMove}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#05090f', overflow: 'hidden',
            fontFamily: "-apple-system,'SF Pro Display','Segoe UI',sans-serif",
            cursor: 'none',
          }}
        >
          {isInitial && (
            <>
              <motion.div
                animate={{ x: [0,60,-30,0], y: [0,-40,30,0], scale: [1,1.1,0.95,1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: -160, left: -100, width: 500, height: 500,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle,rgba(0,210,255,0.07),transparent 65%)',
                  filter: 'blur(40px)', pointerEvents: 'none',
                }}
              />
              <motion.div
                animate={{ x: [0,-50,25,0], y: [0,35,-25,0], scale: [1,1.08,0.92,1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute', bottom: -120, right: -80, width: 400, height: 400,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle,rgba(58,123,213,0.09),transparent 65%)',
                  filter: 'blur(40px)', pointerEvents: 'none',
                }}
              />
            </>
          )}

          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.3 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(rgba(0,210,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,255,0.045) 1px,transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          <div style={{
            position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,#05090f 100%)',
          }} />

          <motion.div
            animate={{ top: ['0%','100%'], opacity: [0,1,1,0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 1, zIndex: 10, pointerEvents: 'none',
              background: 'linear-gradient(90deg,transparent,rgba(0,210,255,0.12),rgba(0,210,255,0.35),rgba(0,210,255,0.12),transparent)',
            }}
          />

          {(['tl','tr','bl','br'] as const).map(pos => (
            <motion.div key={pos}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{
                position: 'absolute', width: 28, height: 28, zIndex: 10, pointerEvents: 'none',
                ...(pos === 'tl' && { top: 20, left: 20, borderTop: '1px solid rgba(0,210,255,0.35)', borderLeft: '1px solid rgba(0,210,255,0.35)' }),
                ...(pos === 'tr' && { top: 20, right: 20, borderTop: '1px solid rgba(0,210,255,0.35)', borderRight: '1px solid rgba(0,210,255,0.35)' }),
                ...(pos === 'bl' && { bottom: 20, left: 20, borderBottom: '1px solid rgba(0,210,255,0.35)', borderLeft: '1px solid rgba(0,210,255,0.35)' }),
                ...(pos === 'br' && { bottom: 20, right: 20, borderBottom: '1px solid rgba(0,210,255,0.35)', borderRight: '1px solid rgba(0,210,255,0.35)' }),
              }}
            />
          ))}

          {/* Magnetic cursor */}
          <motion.div style={{ position: 'absolute', x: mouseX, y: mouseY, width: 6, height: 6, borderRadius: '50%', background: '#00D2FF', zIndex: 999, pointerEvents: 'none', mixBlendMode: 'screen' as const }} />
          <motion.div style={{ position: 'absolute', x: ringX, y: ringY, width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(0,210,255,0.3)', zIndex: 998, pointerEvents: 'none', translateX: '-50%', translateY: '-50%' }} />

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 7, zIndex: 20 }}
          >
            <motion.div
              animate={{ opacity: [1,0.2,1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 8px rgba(0,210,255,0.9)' }}
            />
            <span style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(0,210,255,0.5)', textTransform: 'uppercase' as const }}>
              La tech qui vous inspire
            </span>
          </motion.div>

          <div style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                position: 'relative', padding: '36px 52px', borderRadius: 24,
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(0,210,255,0.1)', overflow: 'hidden',
              }}
            >
              {[{ inset: -18, color: '0,210,255', opacity: '0.12', delay: 0 }, { inset: -36, color: '58,123,213', opacity: '0.07', delay: 1 }].map(({ inset, color, opacity, delay }, i) => (
                <motion.div key={i}
                  animate={{ scale: [1,1.04,1], opacity: [1,0.4,1] }}
                  transition={{ duration: 4, repeat: Infinity, delay }}
                  style={{ position: 'absolute', top: inset, bottom: inset, left: inset, right: inset, borderRadius: 32, border: `1px solid rgba(${color},${opacity})`, pointerEvents: 'none' }}
                />
              ))}
              <motion.div
                animate={{ x: ['-100%','240%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                style={{ position: 'absolute', top: 0, bottom: 0, width: '35%', background: 'linear-gradient(90deg,transparent,rgba(0,210,255,0.05),transparent)', pointerEvents: 'none' }}
              />
              <svg width="250" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D2FF" />
                    <stop offset="100%" stopColor="#3a7bd5" />
                  </linearGradient>
                </defs>
                <rect x="10" y="20" width="80" height="80" rx="15" fill="url(#lg)" />
                <path d="M40 40V80H55C66.0457 80 75 71.0457 75 60C75 48.9543 66.0457 40 55 40H40Z" fill="white" fillOpacity="0.92" />
                <circle cx="47" cy="50" r="4" fill="#3a7bd5" />
                <circle cx="47" cy="70" r="4" fill="#3a7bd5" />
                <text x="110" y="70" fontFamily="-apple-system,'SF Pro Display','Segoe UI',sans-serif" fontWeight="800" fontSize="40" fill="white" opacity="0.96">
                  Digi<tspan fill="url(#lg)">Scia</tspan>
                </text>
                <text x="112" y="96" fontFamily="-apple-system,'SF Pro Display','Segoe UI',sans-serif" fontWeight="400" fontSize="13" letterSpacing="6" fill="rgba(255,255,255,0.32)">
                  STORE
                </text>
              </svg>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: 26, fontSize: 10, letterSpacing: '0.48em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, fontWeight: 500 }}
            >
              Informatique &amp; Électronique
            </motion.span>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 260 }}
            >
              <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 2, position: 'relative' }}>
                <motion.div
                  initial={{ width: '0%' }} animate={{ width: '100%' }}
                  transition={{ delay: 1.2, duration: 3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: '100%', background: 'linear-gradient(90deg,#00D2FF,#3a7bd5)', borderRadius: 2, position: 'relative' }}
                >
                  <div style={{ position: 'absolute', right: -2, top: -3, width: 7, height: 7, borderRadius: '50%', background: '#00D2FF', boxShadow: '0 0 10px 3px rgba(0,210,255,0.55)' }} />
                </motion.div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div key={i}
                      animate={{ opacity: [0.2,1,0.2], scale: [0.7,1,0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay }}
                      style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(0,210,255,0.45)' }}
                    />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentStep}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: stepVisible ? 1 : 0, y: stepVisible ? 0 : -4 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.18)' }}
                  >
                    {currentStep}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            style={{ position: 'absolute', bottom: 20, right: 24, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.1)', zIndex: 20 }}
          >
            v2.4.1
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenSplash;