export const dynamic = "force-static";
export const metadata = { title: "Sin conexión | Marea Tours" };

export default function Offline() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-marea-950 px-6 text-center text-marea-100">
      <div className="text-5xl">🌊</div>
      <h1 className="font-display text-2xl font-bold text-marea-50">Sin conexión</h1>
      <p className="max-w-sm text-marea-300">
        Parece que no tienes internet. Vuelve a intentarlo cuando recuperes la conexión.
      </p>
      <a href="/" className="mt-2 rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-6 py-2.5 font-semibold text-white">
        Reintentar
      </a>
    </div>
  );
}
