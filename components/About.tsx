"use client";

import { Reveal } from "./Reveal";
import { useLang } from "./LanguageContext";

export function About() {
  const { t } = useLang();
  const features = [
    { icon: "🗣️", key: "f1" },
    { icon: "👥", key: "f2" },
    { icon: "🌎", key: "f3" },
    { icon: "❤️", key: "f4" },
  ] as const;

  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="aurora absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-marea-500/20 blur-2xl" />
            <div className="glass relative grid grid-cols-2 gap-4 rounded-3xl p-6">
              {[
                { n: "5+", l: t.hero.stat1 },
                { n: "10k+", l: t.hero.stat2 },
                { n: "4.9★", l: t.hero.stat3 },
                { n: "ES/EN", l: t.hero.stat4 },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-marea-900/50 p-5 text-center">
                  <div className="font-display text-3xl font-bold text-gradient">{s.n}</div>
                  <div className="mt-1 text-xs text-marea-300">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.about.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg text-marea-200">{t.about.p1}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-marea-300">{t.about.p2}</p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.key} delay={0.25 + i * 0.08}>
                <div className="flex items-center gap-3 rounded-xl border border-marea-400/15 bg-marea-900/30 p-4">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-sm font-medium text-marea-100">{t.about[f.key]}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
