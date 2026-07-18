"use client";

import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        if (role) {
          Cookies.set("role", role, { expires: 7 });
          Cookies.set("authToken", await user.getIdToken(), { expires: 7 });
          router.push(role === "organizer" ? "/organizer" : "/volunteer");
        } else {
          setError("User role not found.");
        }
      } else {
        setError("User profile not found in database.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const autofill = (role: "organizer" | "volunteer") => {
    setEmail(`${role}@demo.com`);
    setPassword("password123");
  };

  // 3D Parallax Mouse Tracking Effect
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // max rotation degrees
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[var(--bg-void)] flex flex-col items-center justify-center overflow-hidden relative"
      style={{ perspective: "1000px" }}
    >
      {/* ── Background Cinematic Elements ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[var(--primary-400)] opacity-[0.03] blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-[#8C6D23] opacity-[0.02] blur-[120px]" />
        
        {/* Animated Particles / Dust */}
        <div className="absolute inset-0 dot-grid opacity-30" style={{ backgroundSize: '40px 40px' }} />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at center, var(--primary-400) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            animation: 'float 20s linear infinite',
          }}
        />
      </div>

      {/* ── Centered 3D Graphic (Background Layer) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transition-transform duration-200 ease-out"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg) translateZ(-100px)`,
        }}
      >
        <div className="relative opacity-30 mix-blend-screen scale-150">
          <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="150" rx="180" ry="70" fill="none" stroke="url(#stadiumGlow)" strokeWidth="2" opacity="0.8" />
            <ellipse cx="200" cy="150" rx="140" ry="55" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
            <path d="M 40 150 Q 40 40 200 40 Q 360 40 360 150" fill="url(#stadiumBody)" opacity="0.6" />
            <path d="M 60 145 Q 60 70 200 70 Q 340 70 340 145" fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" />
            <ellipse cx="200" cy="150" rx="100" ry="35" fill="rgba(0,0,0,0.5)" />
            <ellipse cx="200" cy="150" rx="100" ry="35" fill="none" stroke="rgba(249, 229, 150, 0.5)" strokeWidth="1.5" />
            <line x1="200" y1="115" x2="200" y2="185" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
            <ellipse cx="200" cy="150" rx="20" ry="7" fill="none" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1" />
            
            {/* Light Beams */}
            {[50, 150, 250, 350].map((x, i) => (
              <path
                key={i}
                d={`M ${x} 50 L ${x - 50} 200 L ${x + 50} 200 Z`}
                fill="url(#beam)"
                opacity="0.1"
                style={{ transformOrigin: 'top center', animation: 'pulse 4s infinite alternate', animationDelay: `${i}s` }}
              />
            ))}
            
            <defs>
              <radialGradient id="stadiumGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="stadiumBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8C6D23" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="beam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F9E596" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ── Main Foreground UI ── */}
      <div className="z-10 flex flex-col items-center w-full max-w-md px-6 animate-fade-in-up">
        {/* Header / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[var(--primary-400)]/30 px-4 py-1.5 rounded-full mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-400)] animate-pulse" />
            <span className="text-[var(--primary-400)] text-[10px] font-bold uppercase tracking-[0.2em]">VIP Access Portal</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight mb-2 tracking-tight text-white drop-shadow-lg">
            FIFA 2026
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[var(--primary-300)] to-[var(--primary-600)]">
              Operations
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm tracking-wide uppercase font-medium mt-3">
            Command Center Authentication
          </p>
        </div>

        {/* Glass Login Panel */}
        <div
          className="w-full rounded-2xl p-8 backdrop-blur-3xl"
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,20,0.85) 0%, rgba(10,10,10,0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(249, 229, 150, 0.1)',
          }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email-address" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary-400)] mb-2">
                Secure Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vip@fifa2026.com"
                className="w-full bg-[#0A0A0A] border border-[var(--bg-border)] rounded-xl px-4 py-3.5 text-white placeholder-[var(--text-disabled)] text-sm focus:outline-none focus:border-[var(--primary-400)] focus:ring-1 focus:ring-[var(--primary-400)] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--primary-400)] mb-2">
                Access Key
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[var(--bg-border)] rounded-xl px-4 py-3.5 text-white placeholder-[var(--text-disabled)] text-sm focus:outline-none focus:border-[var(--primary-400)] focus:ring-1 focus:ring-[var(--primary-400)] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-950/40 border border-red-500/30 rounded-xl">
                <span className="text-red-400 text-sm shrink-0 mt-0.5">⚠️</span>
                <p className="text-red-300 text-xs leading-snug">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full relative overflow-hidden rounded-xl py-4 px-6 text-sm font-bold uppercase tracking-widest text-[#0A0A0A] transition-all duration-300 disabled:opacity-50"
              style={{
                background: loading
                  ? 'var(--primary-600)'
                  : 'linear-gradient(135deg, var(--primary-300) 0%, var(--primary-500) 100%)',
                boxShadow: loading ? 'none' : '0 10px 30px rgba(212,175,55,0.3)',
              }}
            >
              {!loading && (
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              )}
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authorizing...
                  </>
                ) : (
                  <>Enter Command Center</>
                )}
              </span>
            </button>
          </form>

          {/* Demo role cards */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] text-center mb-4">
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => autofill("organizer")}
                className="group flex flex-col items-center p-3 rounded-xl border border-white/5 bg-[#0A0A0A] hover:border-[var(--primary-400)]/30 hover:bg-[#141414] transition-all duration-300 text-center"
              >
                <span className="text-white font-display text-sm group-hover:text-[var(--primary-400)] transition-colors">Organizer</span>
                <span className="text-[var(--text-disabled)] text-[10px] mt-1 uppercase tracking-wider">Full Access</span>
              </button>
              <button
                type="button"
                onClick={() => autofill("volunteer")}
                className="group flex flex-col items-center p-3 rounded-xl border border-white/5 bg-[#0A0A0A] hover:border-[var(--primary-400)]/30 hover:bg-[#141414] transition-all duration-300 text-center"
              >
                <span className="text-white font-display text-sm group-hover:text-[var(--primary-400)] transition-colors">Volunteer</span>
                <span className="text-[var(--text-disabled)] text-[10px] mt-1 uppercase tracking-wider">Field Ops</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[var(--text-disabled)] text-[10px] uppercase tracking-widest mt-8 font-mono">
          System v1.0.4 · End-to-End Encrypted
        </p>
      </div>
    </div>
  );
}
