import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tours = [
  { slug:"graffiti-comuna-13", titleEs:"Graffiti Tour Comuna 13", titleEn:"Comuna 13 Graffiti Tour",
    summaryEs:"El recorrido imperdible por el arte urbano, las escaleras eléctricas y la historia de transformación.",
    summaryEn:"The must-do walk through street art, the outdoor escalators and the story of transformation.",
    descriptionEs:"Camina con un guía local por las calles que cambiaron la historia de Medellín. Descubre los murales, la música, los grafitis y las historias reales de resiliencia de la Comuna 13. Incluye paradas fotográficas, escaleras eléctricas y una degustación de helados típicos.",
    descriptionEn:"Walk with a local guide through the streets that changed Medellín's history. Discover the murals, music, graffiti and real stories of resilience of Comuna 13. Includes photo stops, the famous outdoor escalators and a taste of local ice cream.",
    price:0, durationMin:180, category:"cultural", meetingPoint:"Estación San Javier (Metro), salida principal", image:"graffiti", maxPeople:15, featured:true, order:1 },
  { slug:"comuna-13-english", titleEs:"Comuna 13 Tour en Inglés", titleEn:"Comuna 13 Tour in English",
    summaryEs:"El mismo recorrido icónico guiado 100% en inglés para viajeros internacionales.",
    summaryEn:"Our iconic walk guided 100% in English for international travelers.",
    descriptionEs:"Nuestro guía bilingüe te lleva por la Comuna 13 explicando cada detalle en inglés fluido. Perfecto para viajeros que quieren entender a fondo la historia y la cultura del barrio.",
    descriptionEn:"Our bilingual guide takes you through Comuna 13 explaining every detail in fluent English. Perfect for travelers who want to fully understand the neighborhood's history and culture.",
    price:0, durationMin:180, category:"cultural", meetingPoint:"San Javier Metro Station, main exit", image:"english", maxPeople:12, featured:true, order:2 },
  { slug:"comuna-13-atardecer", titleEs:"Comuna 13 al Atardecer", titleEn:"Comuna 13 at Sunset",
    summaryEs:"Vive el barrio con otra luz: miradores, música en vivo y el atardecer sobre Medellín.",
    summaryEn:"Experience the neighborhood in a different light: viewpoints, live music and sunset over Medellín.",
    descriptionEs:"Un recorrido especial al final del día cuando la Comuna 13 se llena de música, baile y las mejores vistas del atardecer. Incluye mirador panorámico y show de breakdance local.",
    descriptionEn:"A special late-day walk when Comuna 13 fills with music, dance and the best sunset views. Includes a panoramic viewpoint and a local breakdance show.",
    price:60000, durationMin:210, category:"experiencia", meetingPoint:"Estación San Javier (Metro), salida principal", image:"sunset", maxPeople:12, featured:true, order:3 },
  { slug:"tour-privado-vip", titleEs:"Tour Privado VIP", titleEn:"Private VIP Tour",
    summaryEs:"Experiencia exclusiva y personalizada para tu grupo, con transporte incluido.",
    summaryEn:"Exclusive, personalized experience for your group, transport included.",
    descriptionEs:"Recorrido privado a tu ritmo con guía dedicado, transporte de ida y vuelta desde tu hotel, y paradas personalizadas. Ideal para familias, parejas o grupos de amigos.",
    descriptionEn:"Private tour at your own pace with a dedicated guide, round-trip hotel transport and customized stops. Ideal for families, couples or groups of friends.",
    price:180000, durationMin:240, category:"premium", meetingPoint:"Recogida en tu hotel / Pickup at your hotel", image:"vip", maxPeople:8, featured:false, order:4 },
  { slug:"food-tour-comuna-13", titleEs:"Food Tour Comuna 13", titleEn:"Comuna 13 Food Tour",
    summaryEs:"Saborea la comida callejera auténtica: arepas, mango biche, helados y más.",
    summaryEn:"Taste authentic street food: arepas, green mango, ice cream and more.",
    descriptionEs:"Un recorrido gastronómico por los sabores del barrio. Prueba 6 antojos típicos mientras conoces la cultura local a través de su comida. Incluye todas las degustaciones.",
    descriptionEn:"A culinary walk through the flavors of the neighborhood. Try 6 typical treats while learning about local culture through its food. All tastings included.",
    price:75000, durationMin:180, category:"gastronomia", meetingPoint:"Estación San Javier (Metro), salida principal", image:"food", maxPeople:10, featured:false, order:5 },
  { slug:"graffiti-workshop", titleEs:"Taller de Graffiti", titleEn:"Graffiti Workshop",
    summaryEs:"Aprende a hacer tu propio grafiti con un artista local de la Comuna 13.",
    summaryEn:"Learn to make your own graffiti with a local Comuna 13 artist.",
    descriptionEs:"Después del recorrido, ponte los guantes y crea tu propia obra con spray guiado por un grafitero del barrio. Te llevas tu lienzo a casa. Materiales incluidos.",
    descriptionEn:"After the tour, put on the gloves and create your own spray artwork guided by a neighborhood graffiti artist. Take your canvas home. Materials included.",
    price:90000, durationMin:150, category:"experiencia", meetingPoint:"Estación San Javier (Metro), salida principal", image:"workshop", maxPeople:8, featured:false, order:6 },
];

async function main() {
  console.log("Seeding tours...");
  for (const t of tours) {
    await prisma.tour.upsert({ where: { slug: t.slug }, update: t, create: t });
  }
  console.log(`Seeded ${tours.length} tours.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e); await prisma.$disconnect(); process.exit(1);
});
