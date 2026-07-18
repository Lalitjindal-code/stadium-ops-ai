"use client";

import { useEffect, useRef, useState } from "react";
import { AnalysisResult } from "@/types";

interface Stadium3DViewProps {
  analysisResult: AnalysisResult | null;
}

export default function Stadium3DView({ analysisResult }: Stadium3DViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotY, setRotY] = useState(0);

  // Slow auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotY(prev => (prev + 0.15) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x: x * 10, y: y * 6 });
    };
    const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const isCritical =
    analysisResult?.riskLevel?.toLowerCase() === "critical" ||
    analysisResult?.riskLevel?.toLowerCase() === "high";

  const primary = isCritical ? "#FF4060" : "#D4AF37";
  const glow = isCritical ? "rgba(255,64,96,0.35)" : "rgba(212,175,55,0.3)";
  const standFill = isCritical ? "rgba(255,64,96,0.10)" : "rgba(212,175,55,0.08)";
  const standStroke = isCritical ? "rgba(255,64,96,0.45)" : "rgba(212,175,55,0.35)";
  const pitchBorder = isCritical ? "rgba(255,64,96,0.7)" : "rgba(212,175,55,0.7)";

  // Effective rotation: auto-rotate + mouse offset
  const effectiveRotY = mousePos.x !== 0 ? mousePos.x : Math.sin(rotY * Math.PI / 180) * 12;
  const effectiveRotX = 30 - mousePos.y;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[320px] flex flex-col items-center justify-center overflow-hidden rounded-2xl"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(12,12,18,1) 0%, rgba(6,6,10,1) 100%)",
        border: `1px solid ${isCritical ? "rgba(255,64,96,0.15)" : "rgba(212,175,55,0.1)"}`,
        boxShadow: `0 0 40px ${glow}, inset 0 1px 0 rgba(255,255,255,0.02)`,
        perspective: "1400px",
      }}
    >
      {/* ── Ambient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(ellipse 55% 45% at 50% 55%, ${glow} 0%, transparent 70%)` }}
      />

      {/* ── Subtle dot grid floor ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle, ${primary} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── 3D Stadium SVG ── */}
      <div
        className="relative z-10"
        style={{
          transform: `rotateX(${effectiveRotX}deg) rotateY(${effectiveRotY}deg)`,
          transformStyle: "preserve-3d",
          transition: mousePos.x !== 0 ? "transform 0.15s ease-out" : "none",
        }}
      >
        <svg
          width="580"
          height="330"
          viewBox="0 0 580 330"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pitch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b200b" />
              <stop offset="40%" stopColor="#0d2b0d" />
              <stop offset="100%" stopColor="#091809" />
            </linearGradient>
            <linearGradient id="pitchStripe1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e280e" />
              <stop offset="100%" stopColor="#0b1e0b" />
            </linearGradient>
            <radialGradient id="floodGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={primary} stopOpacity="0.6" />
              <stop offset="100%" stopColor={primary} stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── OUTER SHELL ── */}
          <rect x="15" y="15" width="550" height="300" rx="90" fill="rgba(5,5,9,0.98)" stroke={standStroke} strokeWidth="1.5" />

          {/* ── STAND TIER 3 (outer ring) ── */}
          <rect x="30" y="30" width="520" height="270" rx="78" fill={standFill} stroke={standStroke} strokeWidth="1" opacity="0.8" />
          {/* Stand row lines — Top */}
          {[42, 52, 62].map((y, i) => (
            <rect key={`tr-${i}`} x={40 + i * 12} y={y} width={500 - i * 24} height="5" rx="2.5"
              fill={standFill} stroke={standStroke} strokeWidth="0.5" opacity="0.6" />
          ))}
          {/* Stand row lines — Bottom */}
          {[268, 258, 248].map((y, i) => (
            <rect key={`br-${i}`} x={40 + i * 12} y={y} width={500 - i * 24} height="5" rx="2.5"
              fill={standFill} stroke={standStroke} strokeWidth="0.5" opacity="0.6" />
          ))}
          {/* Stand row lines — Left */}
          {[48, 62, 76].map((x, i) => (
            <rect key={`lr-${i}`} x={x} y={72 + i * 4} width="8" height={186 - i * 8} rx="2"
              fill={standFill} stroke={standStroke} strokeWidth="0.5" opacity="0.5" />
          ))}
          {/* Stand row lines — Right */}
          {[524, 510, 496].map((x, i) => (
            <rect key={`rr-${i}`} x={x} y={72 + i * 4} width="8" height={186 - i * 8} rx="2"
              fill={standFill} stroke={standStroke} strokeWidth="0.5" opacity="0.5" />
          ))}

          {/* ── STAND TIER 2 (middle) ── */}
          <rect x="75" y="68" width="430" height="194" rx="60" fill="rgba(10,8,3,0.95)" stroke={standStroke} strokeWidth="1" />

          {/* ── STAND TIER 1 (inner, closest to pitch) ── */}
          <rect x="118" y="98" width="344" height="134" rx="40" fill="rgba(7,6,2,1)" stroke={primary} strokeWidth="1.2" opacity="0.7" />

          {/* ── PITCH ── */}
          <rect x="148" y="115" width="284" height="100" rx="5" fill="url(#pitch)" stroke={pitchBorder} strokeWidth="1.8" />

          {/* Pitch alternating stripes */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={`s${i}`} x={148 + i * 40} y="115" width="20" height="100"
              fill="url(#pitchStripe1)" opacity="0.5" />
          ))}

          {/* ── PITCH MARKINGS ── */}
          {/* Halfway line */}
          <line x1="290" y1="115" x2="290" y2="215" stroke={pitchBorder} strokeWidth="1.2" opacity="0.7" />
          {/* Center circle */}
          <ellipse cx="290" cy="165" rx="28" ry="20" fill="none" stroke={pitchBorder} strokeWidth="1.2" opacity="0.7" />
          {/* Center spot */}
          <circle cx="290" cy="165" r="3" fill={primary} opacity="0.9" filter="url(#glow)" />
          {/* Left penalty box */}
          <rect x="148" y="136" width="54" height="58" fill="none" stroke={pitchBorder} strokeWidth="1.1" opacity="0.6" />
          {/* Left 6-yard box */}
          <rect x="148" y="148" width="20" height="34" fill="none" stroke={pitchBorder} strokeWidth="0.8" opacity="0.5" />
          {/* Right penalty box */}
          <rect x="378" y="136" width="54" height="58" fill="none" stroke={pitchBorder} strokeWidth="1.1" opacity="0.6" />
          {/* Right 6-yard box */}
          <rect x="412" y="148" width="20" height="34" fill="none" stroke={pitchBorder} strokeWidth="0.8" opacity="0.5" />
          {/* Goals */}
          <rect x="140" y="152" width="10" height="26" fill={primary} fillOpacity="0.25" stroke={primary} strokeWidth="1.2" opacity="0.8" />
          <rect x="430" y="152" width="10" height="26" fill={primary} fillOpacity="0.25" stroke={primary} strokeWidth="1.2" opacity="0.8" />
          {/* Corner arcs */}
          <path d="M148 115 Q162 115 162 129" fill="none" stroke={pitchBorder} strokeWidth="1" opacity="0.5" />
          <path d="M432 115 Q418 115 418 129" fill="none" stroke={pitchBorder} strokeWidth="1" opacity="0.5" />
          <path d="M148 215 Q162 215 162 201" fill="none" stroke={pitchBorder} strokeWidth="1" opacity="0.5" />
          <path d="M432 215 Q418 215 418 201" fill="none" stroke={pitchBorder} strokeWidth="1" opacity="0.5" />
          {/* Penalty spots */}
          <circle cx="192" cy="165" r="2" fill={pitchBorder} opacity="0.7" />
          <circle cx="388" cy="165" r="2" fill={pitchBorder} opacity="0.7" />

          {/* ── FLOODLIGHTS ── */}
          {/* Top-Left */}
          <g filter="url(#glow)">
            <line x1="48" y1="42" x2="48" y2="16" stroke={primary} strokeWidth="2.5" opacity="0.85" />
            <rect x="38" y="10" width="20" height="8" rx="1" fill={primary} opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
            </rect>
            <ellipse cx="48" cy="14" rx="18" ry="5" fill="url(#floodGlow)">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.2s" repeatCount="indefinite" />
            </ellipse>
          </g>
          {/* Top-Right */}
          <g filter="url(#glow)">
            <line x1="532" y1="42" x2="532" y2="16" stroke={primary} strokeWidth="2.5" opacity="0.85" />
            <rect x="522" y="10" width="20" height="8" rx="1" fill={primary} opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.9s" repeatCount="indefinite" />
            </rect>
            <ellipse cx="532" cy="14" rx="18" ry="5" fill="url(#floodGlow)">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.9s" repeatCount="indefinite" />
            </ellipse>
          </g>
          {/* Bottom-Left */}
          <g filter="url(#glow)">
            <line x1="48" y1="288" x2="48" y2="314" stroke={primary} strokeWidth="2.5" opacity="0.85" />
            <rect x="38" y="312" width="20" height="8" rx="1" fill={primary} opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <ellipse cx="48" cy="316" rx="18" ry="5" fill="url(#floodGlow)">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
          </g>
          {/* Bottom-Right */}
          <g filter="url(#glow)">
            <line x1="532" y1="288" x2="532" y2="314" stroke={primary} strokeWidth="2.5" opacity="0.85" />
            <rect x="522" y="312" width="20" height="8" rx="1" fill={primary} opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.0s" repeatCount="indefinite" />
            </rect>
            <ellipse cx="532" cy="316" rx="18" ry="5" fill="url(#floodGlow)">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.0s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* ── CRITICAL ALERTS ── */}
          {isCritical && (
            <>
              <circle cx="200" cy="80" r="5" fill="#FF4060" filter="url(#glow)">
                <animate attributeName="r" values="3;7;3" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <text x="212" y="84" fill="#FF4060" fontSize="9" fontWeight="bold" opacity="0.9">CONGESTION</text>
              <circle cx="390" cy="250" r="4" fill="#FF4060" filter="url(#glow)">
                <animate attributeName="r" values="2;6;2" dur="1.7s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.7s" repeatCount="indefinite" />
              </circle>
              <text x="400" y="254" fill="#FF4060" fontSize="9" fontWeight="bold" opacity="0.9">ALERT</text>
            </>
          )}
        </svg>
      </div>

      {/* ── Top-Left Compact AI Overlay ── */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 backdrop-blur-md shadow-sm"
          style={{
            background: "rgba(6,6,10,0.6)",
            border: `1px solid ${isCritical ? "rgba(255,64,96,0.2)" : "rgba(212,175,55,0.15)"}`,
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: primary, boxShadow: `0 0 6px ${primary}`, animation: "pulse 2s infinite" }}
          />
          <span className="text-[10px] font-mono font-bold uppercase" style={{ color: primary }}>
            {analysisResult
              ? `${analysisResult.riskLevel} Risk`
              : "Standby"}
          </span>
        </div>
        {analysisResult && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 backdrop-blur-md shadow-sm bg-[var(--bg-elevated)]/40 border border-[var(--bg-border)]/50">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">AI Conf</span>
            <span className="text-[10px] font-mono font-bold text-[var(--primary-400)]">{(analysisResult.confidence * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* ── Corner brackets ── */}
      {["top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"
      ].map((cls, i) => (
        <div key={i} className={`absolute w-3 h-3 ${cls} opacity-20`} style={{ borderColor: primary }} />
      ))}
    </div>
  );
}
