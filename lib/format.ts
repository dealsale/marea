export function formatPrice(price: number, currency = "COP", lang: "es" | "en" = "es") {
  if (price === 0) return lang === "es" ? "Gratis" : "Free";
  return new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function whatsappUrl(number: string, text: string) {
  const clean = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}
