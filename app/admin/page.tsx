import { isAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Panel Admin | Marea Tours", robots: "noindex" };

export default async function AdminPage() {
  const authed = await isAuthenticated();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}
