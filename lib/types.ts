export type ActivityDTO = {
  id: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  price: number;
  optional: boolean;
  bookableAlone: boolean;
  durationMin: number;
};

export type PackageDTO = {
  id: string;
  slug: string;
  lineId: string;
  type: "tour" | "escape" | "hospedaje" | string;
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  currency: string;
  durationMin: number;
  meetingPoint: string;
  image: string;
  availableDays: string;
  blockedDates: string;
  maxPeople: number;
  featured: boolean;
  activities: ActivityDTO[];
};

export type LineDTO = {
  id: string;
  slug: string;
  nameEs: string;
  nameEn: string;
  taglineEs: string;
  taglineEn: string;
  emoji: string;
  color: string;
  image: string;
  packages: PackageDTO[];
};

export const PACKAGE_TYPES = ["tour", "escape", "hospedaje"] as const;
export const TYPE_LABELS: Record<string, { es: string; en: string }> = {
  tour: { es: "Marea Tour", en: "Marea Tour" },
  escape: { es: "Marea Escape", en: "Marea Escape" },
  hospedaje: { es: "Marea Hospedaje", en: "Marea Stay" },
};
