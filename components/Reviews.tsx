"use client";

import { Reveal } from "./Reveal";
import { useLang } from "./LanguageContext";

const reviews = [
  { name: "Sarah M.", country: "🇺🇸 USA", es: "El mejor tour de Medellín. Nuestro guía hablaba inglés perfecto y contó historias increíbles.", en: "The best tour in Medellín. Our guide spoke perfect English and shared incredible stories." },
  { name: "Camila R.", country: "🇨🇴 Colombia", es: "Una experiencia que te toca el corazón. Se nota el amor por la comuna. ¡100% recomendado!", en: "A heartwarming experience. You can feel the love for the neighborhood. 100% recommended!" },
  { name: "Lucas B.", country: "🇩🇪 Germany", es: "Increíble que sea a la gorra. Vale muchísimo más. Guías muy profesionales y amables.", en: "Amazing that it's tip-based. Worth so much more. Very professional and friendly guides." },
  { name: "Marie L.", country: "🇫🇷 France", es: "El atardecer desde la Comuna 13 fue mágico. La música, el baile, todo perfecto.", en: "Sunset from Comuna 13 was magical. The music, the dancing, everything perfect." },
  { name: "James K.", country: "🇬🇧 UK", es: "Aprendí muchísimo sobre la historia real de Medellín. Muy seguro y bien organizado.", en: "I learned so much about the real history of Medellín. Very safe and well organized." },
  { name: "Ana P.", country: "🇪🇸 España", es: "El food tour fue delicioso. Probamos de todo y el guía era un amor. Repetiré seguro.", en: "The food tour was delicious. We tried everything and the guide was lovely. Will repeat for sure." },
];

export function Reviews() {
  const { t, lang } = useLang();
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-5 py-24">
      <Reveal className="text-center">
        <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.reviews.title}</h2>
        <p className="mt-3 text-marea-300">{t.reviews.subtitle}</p>
      </Reveal>

      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 0.08} className="mb-6 break-inside-avoid">
            <div className="rounded-2xl border border-marea-400/15 bg-marea-900/40 p-6">
              <div className="flex text-amber-400">{"★★★★★"}</div>
              <p className="mt-3 text-marea-100">“{lang === "es" ? r.es : r.en}”</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-marea-400 to-marea-700 font-bold text-white">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-marea-50">{r.name}</div>
                  <div className="text-xs text-marea-400">{r.country}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
