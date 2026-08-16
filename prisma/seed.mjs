import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ---- Lines (regions) ----
const lines = [
  { slug: "paisa", nameEs: "Marea Paisa", nameEn: "Marea Paisa", emoji: "🏔️", color: "#7c3aed", order: 1,
    taglineEs: "Medellín, la Comuna 13 y el oriente antioqueño.", taglineEn: "Medellín, Comuna 13 and eastern Antioquia." },
  { slug: "caribe", nameEs: "Marea Caribe", nameEn: "Marea Caribe", emoji: "🏖️", color: "#0891b2", order: 2,
    taglineEs: "Cartagena, el mar de siete colores y playas de ensueño.", taglineEn: "Cartagena, the sea of seven colors and dream beaches." },
  { slug: "selva-y-mar", nameEs: "Marea Selva y Mar", nameEn: "Marea Jungle & Sea", emoji: "🌴", color: "#059669", order: 3,
    taglineEs: "Amazonas, el Pacífico y la naturaleza más viva.", taglineEn: "The Amazon, the Pacific and the wildest nature." },
];

// ---- Packages per line. type: tour | escape | hospedaje ----
// price: tour/escape = per person · hospedaje = per night. activities: price 0 = included.
const packages = [
  // ===== PAISA =====
  { line: "paisa", type: "tour", slug: "graffiti-tour-comuna-13", image: "graffiti", price: 0, durationMin: 180, maxPeople: 15, featured: true, order: 1,
    titleEs: "Graffiti Tour Comuna 13", titleEn: "Comuna 13 Graffiti Tour",
    summaryEs: "Arte urbano, escaleras eléctricas e historia de transformación.", summaryEn: "Street art, outdoor escalators and a story of transformation.",
    descriptionEs: "El recorrido imperdible por la Comuna 13 con guías locales. Gratis, a la gorra.", descriptionEn: "The must-do Comuna 13 walk with local guides. Free, tip-based.",
    meetingPoint: "Estación San Javier (Metro)",
    activities: [
      { nameEs: "Recorrido guiado", nameEn: "Guided walk", price: 0 },
      { nameEs: "Escaleras eléctricas", nameEn: "Outdoor escalators", price: 0 },
      { nameEs: "Show de breakdance", nameEn: "Breakdance show", price: 0 },
      { nameEs: "Degustación de helados", nameEn: "Ice cream tasting", price: 0 },
      { nameEs: "Taller de graffiti", nameEn: "Graffiti workshop", price: 90000, optional: true, bookableAlone: true, durationMin: 90 },
    ] },
  { line: "paisa", type: "escape", slug: "escape-guatape-penol", image: "sunset", price: 180000, durationMin: 600, maxPeople: 12, featured: true, order: 2,
    titleEs: "Escape a Guatapé & El Peñol", titleEn: "Guatapé & El Peñol Escape",
    summaryEs: "El pueblo más colorido y la vista desde la Piedra.", summaryEn: "The most colorful town and the view from the Rock.",
    descriptionEs: "Día completo a Guatapé: subida a la Piedra del Peñol, paseo en bote y el malecón.", descriptionEn: "Full day to Guatapé: climb the Peñol Rock, boat ride and the waterfront.",
    meetingPoint: "Recogida en tu hotel / Pickup at your hotel",
    activities: [
      { nameEs: "Subida a la Piedra del Peñol", nameEn: "Climb the Peñol Rock", price: 0 },
      { nameEs: "Paseo en bote", nameEn: "Boat ride", price: 0 },
      { nameEs: "Recorrido por el malecón", nameEn: "Waterfront walk", price: 0 },
      { nameEs: "Almuerzo típico", nameEn: "Typical lunch", price: 45000, optional: true },
    ] },
  { line: "paisa", type: "hospedaje", slug: "glamping-oriente-antioqueno", image: "vip", price: 220000, durationMin: 0, maxPeople: 4, order: 3,
    titleEs: "Glamping en el Oriente Antioqueño", titleEn: "Glamping in Eastern Antioquia",
    summaryEs: "Naturaleza, fogata y desayuno. Precio por noche.", summaryEn: "Nature, campfire and breakfast. Price per night.",
    descriptionEs: "Domos con vista, ideales para desconectarse cerca de Medellín.", descriptionEn: "Domes with a view, ideal to disconnect near Medellín.",
    meetingPoint: "Guatapé / Oriente",
    activities: [
      { nameEs: "Desayuno incluido", nameEn: "Breakfast included", price: 0 },
      { nameEs: "Fogata nocturna", nameEn: "Evening campfire", price: 0 },
      { nameEs: "Tour cafetero", nameEn: "Coffee farm tour", price: 60000, optional: true, bookableAlone: true, durationMin: 180 },
    ] },

  // ===== CARIBE =====
  { line: "caribe", type: "tour", slug: "city-tour-cartagena", image: "english", price: 70000, durationMin: 240, maxPeople: 14, featured: true, order: 1,
    titleEs: "City Tour Cartagena Amurallada", titleEn: "Walled Cartagena City Tour",
    summaryEs: "Ciudad amurallada, Getsemaní y San Felipe.", summaryEn: "Walled city, Getsemaní and San Felipe.",
    descriptionEs: "Recorre la historia y el color de Cartagena con guía local.", descriptionEn: "Explore Cartagena's history and color with a local guide.",
    meetingPoint: "Torre del Reloj",
    activities: [
      { nameEs: "Ciudad amurallada", nameEn: "Walled city", price: 0 },
      { nameEs: "Arte urbano en Getsemaní", nameEn: "Getsemaní street art", price: 0 },
      { nameEs: "Castillo San Felipe", nameEn: "San Felipe Castle", price: 40000, optional: true },
    ] },
  { line: "caribe", type: "escape", slug: "escape-islas-del-rosario", image: "sunset", price: 650000, durationMin: 0, maxPeople: 10, featured: true, order: 2,
    titleEs: "Escape Islas del Rosario · 3 días", titleEn: "Rosario Islands Escape · 3 days",
    summaryEs: "Snorkel, Playa Blanca y el mar turquesa.", summaryEn: "Snorkeling, Playa Blanca and the turquoise sea.",
    descriptionEs: "Tres días en el paraíso del Caribe con traslados y actividades.", descriptionEn: "Three days in the Caribbean paradise with transfers and activities.",
    meetingPoint: "Muelle de La Bodeguita",
    activities: [
      { nameEs: "Snorkel en el arrecife", nameEn: "Reef snorkeling", price: 0 },
      { nameEs: "Playa Blanca", nameEn: "Playa Blanca", price: 0 },
      { nameEs: "Oceanario", nameEn: "Oceanarium", price: 50000, optional: true },
      { nameEs: "Cena caribeña", nameEn: "Caribbean dinner", price: 60000, optional: true },
    ] },
  { line: "caribe", type: "hospedaje", slug: "hotel-boutique-centro-historico", image: "vip", price: 320000, durationMin: 0, maxPeople: 3, order: 3,
    titleEs: "Hotel Boutique en el Centro Histórico", titleEn: "Boutique Hotel in the Old Town",
    summaryEs: "Encanto colonial con piscina. Precio por noche.", summaryEn: "Colonial charm with a pool. Price per night.",
    descriptionEs: "Duerme en el corazón amurallado de Cartagena.", descriptionEn: "Sleep in the walled heart of Cartagena.",
    meetingPoint: "Centro Histórico, Cartagena",
    activities: [
      { nameEs: "Desayuno incluido", nameEn: "Breakfast included", price: 0 },
      { nameEs: "Piscina", nameEn: "Pool", price: 0 },
      { nameEs: "Tour nocturno en chiva", nameEn: "Night chiva party tour", price: 55000, optional: true, bookableAlone: true, durationMin: 120 },
    ] },

  // ===== SELVA Y MAR =====
  { line: "selva-y-mar", type: "tour", slug: "avistamiento-ballenas-nuqui", image: "food", price: 120000, durationMin: 240, maxPeople: 10, featured: true, order: 1,
    titleEs: "Avistamiento de Ballenas · Nuquí", titleEn: "Whale Watching · Nuquí",
    summaryEs: "Ballenas jorobadas en el Pacífico chocoano.", summaryEn: "Humpback whales in the Chocó Pacific.",
    descriptionEs: "Salida en lancha con guía biólogo (temporada jul–oct).", descriptionEn: "Boat trip with a biologist guide (Jul–Oct season).",
    meetingPoint: "Nuquí, Chocó",
    activities: [
      { nameEs: "Salida en lancha", nameEn: "Boat trip", price: 0 },
      { nameEs: "Guía biólogo", nameEn: "Biologist guide", price: 0 },
      { nameEs: "Termales de Nuquí", nameEn: "Nuquí hot springs", price: 40000, optional: true, bookableAlone: true, durationMin: 120 },
    ] },
  { line: "selva-y-mar", type: "escape", slug: "escape-amazonas-leticia", image: "workshop", price: 900000, durationMin: 0, maxPeople: 8, featured: true, order: 2,
    titleEs: "Escape Amazonas · 4 días (Leticia)", titleEn: "Amazon Escape · 4 days (Leticia)",
    summaryEs: "Río Amazonas, delfines rosados y comunidades.", summaryEn: "Amazon River, pink dolphins and communities.",
    descriptionEs: "Inmersión en la selva con navegación, fauna y cultura indígena.", descriptionEn: "Jungle immersion with river navigation, wildlife and indigenous culture.",
    meetingPoint: "Aeropuerto de Leticia",
    activities: [
      { nameEs: "Navegación por el río Amazonas", nameEn: "Amazon River navigation", price: 0 },
      { nameEs: "Delfines rosados", nameEn: "Pink dolphins", price: 0 },
      { nameEs: "Comunidad indígena", nameEn: "Indigenous community", price: 0 },
      { nameEs: "Caminata nocturna en la selva", nameEn: "Night jungle walk", price: 70000, optional: true },
    ] },
  { line: "selva-y-mar", type: "hospedaje", slug: "ecolodge-pacifico", image: "vip", price: 280000, durationMin: 0, maxPeople: 4, order: 3,
    titleEs: "Ecolodge en el Pacífico", titleEn: "Pacific Ecolodge",
    summaryEs: "Frente al mar, pensión completa. Precio por noche.", summaryEn: "Oceanfront, full board. Price per night.",
    descriptionEs: "Cabañas sostenibles entre selva y océano.", descriptionEn: "Sustainable cabins between jungle and ocean.",
    meetingPoint: "Bahía Solano / Nuquí",
    activities: [
      { nameEs: "Pensión completa", nameEn: "Full board", price: 0 },
      { nameEs: "Yoga al amanecer", nameEn: "Sunrise yoga", price: 0 },
      { nameEs: "Kayak en el manglar", nameEn: "Mangrove kayak", price: 50000, optional: true, bookableAlone: true, durationMin: 120 },
    ] },
];

async function main() {
  console.log("Seeding lines...");
  const lineIds = {};
  for (const l of lines) {
    const { slug, ...rest } = l;
    const row = await prisma.line.upsert({ where: { slug }, update: rest, create: { slug, ...rest } });
    lineIds[slug] = row.id;
  }

  console.log("Seeding packages + activities...");
  for (const p of packages) {
    const { line, activities, ...rest } = p;
    const lineId = lineIds[line];
    const existing = await prisma.package.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.package.update({ where: { slug: p.slug }, data: { ...rest, lineId } });
    } else {
      await prisma.package.create({
        data: {
          ...rest,
          lineId,
          activities: { create: activities.map((a, i) => ({ order: i, ...a })) },
        },
      });
    }
  }
  const [nl, np, na] = await Promise.all([prisma.line.count(), prisma.package.count(), prisma.activity.count()]);
  console.log(`Seeded ${nl} lines, ${np} packages, ${na} activities.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e); await prisma.$disconnect(); process.exit(1);
});
