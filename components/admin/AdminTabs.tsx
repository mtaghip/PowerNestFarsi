import Link from "next/link";
import { css } from "@/lib/css";
import { faNum } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/admin/actions";

const teal = "#0F5B52";

/**
 * Navigation shared by the admin screens. Deliberately not in the admin
 * layout: that also wraps the login page, and the unread badge would then
 * report how many enquiries exist to anyone who loads it while signed out.
 */
export default async function AdminTabs({ active }: { active: "products" | "leads" }) {
  const unhandled = await prisma.lead.count({ where: { handled: false } });

  const tabs = [
    { href: "/admin", key: "products" as const, label: "محصولات", badge: 0 },
    { href: "/admin/leads", key: "leads" as const, label: "استعلام‌ها", badge: unhandled },
  ];

  return (
    <div className="r-wrap" style={css`display:flex;align-items:center;gap:8px;margin-bottom:22px;flex-wrap:wrap`}>
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.href}
            href={t.href}
            style={css`display:flex;align-items:center;gap:8px;border:1px solid ${on ? teal : "#E3EAE8"};background:${on ? "#E8F2F0" : "#fff"};color:${on ? teal : "#3D5451"};padding:10px 18px;border-radius:10px;font-size:14px;font-weight:600`}
          >
            {t.label}
            {t.badge > 0 && (
              <span
                style={css`background:#EFA00B;color:#3A2600;border-radius:20px;padding:1px 8px;font-size:12px;font-weight:700`}
              >
                {faNum(t.badge)}
              </span>
            )}
          </Link>
        );
      })}
      <span className="r-wrap-spacer" style={css`flex:1`}></span>
      <form action={logoutAction}>
        <button
          type="submit"
          style={css`border:1px solid #CBD9D6;background:#fff;padding:10px 18px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer`}
        >
          خروج
        </button>
      </form>
    </div>
  );
}
