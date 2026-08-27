import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/session";

export async function requireAdmin() {
  const ok = await isAdminAuthed();
  if (!ok) redirect("/admin/login");
}
