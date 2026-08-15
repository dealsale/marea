"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "../Logo";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Error");
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-marea-950 px-5">
      <div className="aurora fixed inset-0 opacity-40" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass relative w-full max-w-sm rounded-3xl p-8"
      >
        <div className="flex flex-col items-center">
          <LogoMark className="h-16 w-16" />
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Panel Admin</h1>
          <p className="mt-1 text-sm text-marea-300">Marea Tours</p>
        </div>
        <label className="mt-8 block text-sm text-marea-300">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="mt-1.5 w-full rounded-xl border border-marea-400/20 bg-marea-900/50 px-4 py-3 text-white outline-none focus:border-marea-400"
          placeholder="••••••••"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-glow mt-6 w-full rounded-full bg-gradient-to-r from-marea-400 to-marea-700 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <a href="/" className="mt-4 block text-center text-sm text-marea-400 hover:text-marea-200">
          ← Volver al sitio
        </a>
      </motion.form>
    </div>
  );
}
