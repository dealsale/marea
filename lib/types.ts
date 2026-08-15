export type TourDTO = {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  currency: string;
  durationMin: number;
  category: string;
  meetingPoint: string;
  image: string;
  maxPeople: number;
  featured: boolean;
};
