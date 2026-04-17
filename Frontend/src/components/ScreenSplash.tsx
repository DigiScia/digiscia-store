import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreenSplashProps {
  isLoading: boolean;
  message?: string;
  isInitial?: boolean;
}

const ScreenSplash: React.FC<ScreenSplashProps> = ({
  isLoading,
  message = "Initialisation",
  isInitial = false,
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#060b14',
            overflow: 'hidden',
            fontFamily: "-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif",
          }}
        >
          {/* Grid overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(0,210,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.07) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }}
          />

          {/* Ambient orbs */}
          {isInitial && (
            <>
              <motion.div
                animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: -80, left: -60,
                  width: 360, height: 360,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,210,255,0.12), transparent 70%)',
                  filter: 'blur(80px)',
                  pointerEvents: 'none',
                }}
              />
              <motion.div
                animate={{ x: [0, -35, 20, 0], y: [0, 25, -20, 0], scale: [1, 1.1, 0.9, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute',
                  bottom: -60, right: -40,
                  width: 300, height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(58,123,213,0.14), transparent 70%)',
                  filter: 'blur(80px)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          {/* Corner brackets */}
          {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
            <motion.div
              key={pos}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'absolute',
                width: 32, height: 32,
                ...(pos === 'tl' && { top: 24, left: 24, borderTop: '1px solid rgba(0,210,255,0.4)', borderLeft: '1px solid rgba(0,210,255,0.4)' }),
                ...(pos === 'tr' && { top: 24, right: 24, borderTop: '1px solid rgba(0,210,255,0.4)', borderRight: '1px solid rgba(0,210,255,0.4)' }),
                ...(pos === 'bl' && { bottom: 24, left: 24, borderBottom: '1px solid rgba(0,210,255,0.4)', borderLeft: '1px solid rgba(0,210,255,0.4)' }),
                ...(pos === 'br' && { bottom: 24, right: 24, borderBottom: '1px solid rgba(0,210,255,0.4)', borderRight: '1px solid rgba(0,210,255,0.4)' }),
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Scan line */}
          <motion.div
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.15), rgba(0,210,255,0.4), rgba(0,210,255,0.15), transparent)',
              pointerEvents: 'none',
            }}
          />

          {/* Status bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              zIndex: 20,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 5, height: 5,
                borderRadius: '50%',
                background: '#00D2FF',
                boxShadow: '0 0 6px rgba(0,210,255,0.8)',
              }}
            />
            <span style={{
              fontSize: 9,
              letterSpacing: '0.25em',
              color: 'rgba(0,210,255,0.5)',
              textTransform: 'uppercase',
            }}>
              La tech qui vous inspire ...
            </span>
          </motion.div>

          {/* Main center content */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Logo card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative',
                padding: '32px 44px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,210,255,0.12)',
                overflow: 'hidden',
              }}
            >
              {/* Outer rings */}
              {[{ inset: -16, delay: 0 }, { inset: -32, delay: 0.8 }].map(({ inset, delay }, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.08, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, delay }}
                  style={{
                    position: 'absolute',
                    top: inset, bottom: inset, left: inset, right: inset,
                    borderRadius: 28,
                    border: `1px solid rgba(${i === 0 ? '0,210,255' : '58,123,213'},${i === 0 ? '0.15' : '0.08'})`,
                    pointerEvents: 'none',
                  }}
                />
              ))}

              {/* Shimmer sweep */}
              <motion.div
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  width: '40%',
                  background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.06), transparent)',
                  pointerEvents: 'none',
                }}
              />

              {/* Logo SVG */}
              <svg width="240" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D2FF" />
                    <stop offset="100%" stopColor="#3a7bd5" />
                  </linearGradient>
                </defs>
                <rect x="10" y="20" width="80" height="80" rx="15" fill="url(#g1)" />
                <path d="M40 40V80H55C66.0457 80 75 71.0457 75 60C75 48.9543 66.0457 40 55 40H40Z" fill="white" fillOpacity="0.92" />
                <circle cx="47" cy="50" r="4" fill="#3a7bd5" />
                <circle cx="47" cy="70" r="4" fill="#3a7bd5" />
                <text x="110" y="70" fontFamily="-apple-system,'SF Pro Display','Segoe UI',sans-serif" fontWeight="800" fontSize="40" fill="white" opacity="0.95">
                  Digi<tspan fill="url(#g1)">Scia</tspan>
                </text>
                <text x="112" y="96" fontFamily="-apple-system,'SF Pro Display','Segoe UI',sans-serif" fontWeight="400" fontSize="13" letterSpacing="6" fill="rgba(255,255,255,0.35)">
                  STORE
                </text>
              </svg>
            </motion.div>

            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginTop: 28,
                fontSize: 10,
                letterSpacing: '0.5em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Informatique &amp; Électronique
            </motion.span>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                marginTop: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                width: 280,
              }}
            >
              <div style={{
                width: '100%',
                height: 1,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 2.8, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #00D2FF, #3a7bd5)',
                    borderRadius: 2,
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay }}
                    style={{
                      width: 3, height: 3,
                      borderRadius: '50%',
                      background: 'rgba(0,210,255,0.5)',
                    }}
                  />
                ))}
                {message && (
                  <span style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}>
                    {message}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Version tag */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{
              position: 'absolute',
              bottom: 22, right: 28,
              fontSize: 9,
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.12)',
              zIndex: 20,
            }}
          >
            v2.4.1
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenSplash;
