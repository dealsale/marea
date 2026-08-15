"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "./LanguageContext";
import { CO_VIEWBOX, CO_DEPTS, CO_PATHS } from "@/lib/colombia";

export function ColombiaMap() {
  const { lang } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const dept = CO_DEPTS.find((d) => d.id === active) || null;

  const track = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: clientX - r.left, y: clientY - r.top });
  };

  // keep the popover inside the container
  const width = wrapRef.current?.offsetWidth ?? 340;
  const POP_W = 224;
  const left = Math.min(Math.max(pos.x + 16, 8), Math.max(width - POP_W - 8, 8));
  const top = Math.max(pos.y - 12, 8);

  return (
    <div
      ref={wrapRef}
      className="relative w-[300px] max-w-full sm:w-[340px]"
      onMouseMove={(e) => track(e.clientX, e.clientY)}
    >
      {/* ambient glow */}
      <div className="absolute -inset-8 rounded-full bg-marea-500/25 blur-3xl" />

      <svg
        viewBox={CO_VIEWBOX}
        className="relative h-auto w-full drop-shadow-[0_10px_40px_rgba(124,58,237,0.45)]"
        role="img"
        aria-label={lang === "es" ? "Mapa interactivo de Colombia" : "Interactive map of Colombia"}
      >
        {CO_DEPTS.map((d) => {
          const on = active === d.id;
          return (
            <path
              key={d.id}
              d={CO_PATHS[d.id]}
              onMouseEnter={() => setActive(d.id)}
              onMouseLeave={() => setActive((a) => (a === d.id ? null : a))}
              onClick={(e) => {
                track(e.clientX, e.clientY);
                setActive((a) => (a === d.id ? null : d.id));
              }}
              style={{
                fill: on ? "#e9d5ff" : "#5b21b6",
                stroke: on ? "#f472b6" : "#a78bfa",
                strokeWidth: on ? 1.4 : 0.7,
                cursor: "pointer",
                transition: "fill .18s, stroke .18s",
                filter: on ? "drop-shadow(0 0 6px rgba(233,213,255,.9))" : "none",
              }}
            >
              <title>{d.name}</title>
            </path>
          );
        })}
      </svg>

      {dept && (
        <motion.div
          key={dept.id}
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute z-30 w-56 rounded-2xl border border-marea-400/30 bg-marea-950/90 p-3.5 shadow-xl shadow-marea-950/60 backdrop-blur"
          style={{ left, top }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{dept.emoji}</span>
            <span className="font-display text-base font-bold text-white">{dept.name}</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-marea-200">
            {lang === "es" ? dept.es : dept.en}
          </p>
        </motion.div>
      )}

      <p className="mt-4 text-center text-xs text-marea-300">
        {lang === "es" ? "✨ Pasa el cursor o toca un departamento" : "✨ Hover or tap a department"}
      </p>
    </div>
  );
}
