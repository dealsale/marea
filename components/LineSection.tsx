"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { PackageCard } from "./PackageCard";
import { useLang } from "./LanguageContext";
import { PACKAGE_TYPES, TYPE_LABELS, type LineDTO, type PackageDTO } from "@/lib/types";

export function LineSection({
  line,
  index,
  onBook,
  onDetails,
}: {
  line: LineDTO;
  index: number;
  onBook: (id: string) => void;
  onDetails: (pkg: PackageDTO) => void;
}) {
  const { t, lang } = useLang();
  const [type, setType] = useState<string>("all");

  const typesPresent = PACKAGE_TYPES.filter((tp) => line.packages.some((p) => p.type === tp));
  const shown = type === "all" ? line.packages : line.packages.filter((p) => p.type === type);
  if (line.packages.length === 0) return null;

  return (
    <div className="relative py-8">
      {/* subtle line accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-20 blur-3xl"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${line.color}, transparent 70%)` }}
      />
      <div className="relative">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{line.emoji}</span>
              <h3 className="font-display text-3xl font-bold text-white">{lang === "es" ? line.nameEs : line.nameEn}</h3>
            </div>
            <p className="mt-1 text-marea-300">{lang === "es" ? line.taglineEs : line.taglineEn}</p>
          </div>
          {typesPresent.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setType("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${type === "all" ? "bg-marea-500 text-white" : "bg-marea-900/50 text-marea-300 hover:text-white"}`}
              >
                {t.shop.allTypes}
              </button>
              {typesPresent.map((tp) => (
                <button
                  key={tp}
                  onClick={() => setType(tp)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${type === tp ? "bg-marea-500 text-white" : "bg-marea-900/50 text-marea-300 hover:text-white"}`}
                >
                  {TYPE_LABELS[tp][lang]}
                </button>
              ))}
            </div>
          )}
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} onBook={onBook} onDetails={onDetails} />
          ))}
        </div>
      </div>
    </div>
  );
}
