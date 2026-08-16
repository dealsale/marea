import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import type { LineDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lines = await prisma.line.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: {
      packages: {
        where: { active: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: { activities: { orderBy: { order: "asc" } } },
      },
    },
  });

  const dto: LineDTO[] = lines.map((l) => ({
    id: l.id,
    slug: l.slug,
    nameEs: l.nameEs,
    nameEn: l.nameEn,
    taglineEs: l.taglineEs,
    taglineEn: l.taglineEn,
    emoji: l.emoji,
    color: l.color,
    image: l.image,
    packages: l.packages.map((p) => ({
      id: p.id,
      slug: p.slug,
      lineId: p.lineId,
      type: p.type,
      titleEs: p.titleEs,
      titleEn: p.titleEn,
      summaryEs: p.summaryEs,
      summaryEn: p.summaryEn,
      descriptionEs: p.descriptionEs,
      descriptionEn: p.descriptionEn,
      price: p.price,
      currency: p.currency,
      durationMin: p.durationMin,
      meetingPoint: p.meetingPoint,
      image: p.image,
      availableDays: p.availableDays,
      blockedDates: p.blockedDates,
      maxPeople: p.maxPeople,
      featured: p.featured,
      activities: p.activities.map((a) => ({
        id: a.id,
        nameEs: a.nameEs,
        nameEn: a.nameEn,
        descEs: a.descEs,
        descEn: a.descEn,
        price: a.price,
        optional: a.optional,
        bookableAlone: a.bookableAlone,
        durationMin: a.durationMin,
      })),
    })),
  }));

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";
  return <HomeClient lines={dto} whatsappNumber={whatsappNumber} />;
}
