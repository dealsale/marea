import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import type { TourDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tours = await prisma.tour.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const dto: TourDTO[] = tours.map((t) => ({
    id: t.id,
    slug: t.slug,
    titleEs: t.titleEs,
    titleEn: t.titleEn,
    summaryEs: t.summaryEs,
    summaryEn: t.summaryEn,
    descriptionEs: t.descriptionEs,
    descriptionEn: t.descriptionEn,
    price: t.price,
    currency: t.currency,
    durationMin: t.durationMin,
    category: t.category,
    meetingPoint: t.meetingPoint,
    image: t.image,
    maxPeople: t.maxPeople,
    featured: t.featured,
  }));

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";

  return <HomeClient tours={dto} whatsappNumber={whatsappNumber} />;
}
