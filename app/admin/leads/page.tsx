import Link from "next/link";
import { css } from "@/lib/css";
import { faNum, faDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toggleLeadHandledAction } from "@/app/admin/actions";
import AdminTabs from "@/components/admin/AdminTabs";
import DeleteLeadButton from "@/components/admin/DeleteLeadButton";

const teal = "#0F5B52";

// Enquiries arrive while the page is cached, so read them fresh on every load.
export const dynamic = "force-dynamic";

type Filter = "new" | "all";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  await requireAdmin();

  const { filter: rawFilter } = await searchParams;
  const filter: Filter = rawFilter === "all" ? "all" : "new";

  const [leads, totalCount, newCount] = await Promise.all([
    prisma.lead.findMany({
      where: filter === "new" ? { handled: false } : {},
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { handled: false } }),
  ]);

  // Enquiries store the slug rather than a product relation, so resolve the
  // names in one query instead of per row.
  const slugs = [...new Set(leads.map((l) => l.productSlug).filter((s): s is string => Boolean(s)))];
  const products = slugs.length
    ? await prisma.product.findMany({ where: { slug: { in: slugs } }, select: { slug: true, name: true } })
    : [];
  const nameBySlug = new Map(products.map((p) => [p.slug, p.name]));

  const filters: { v: Filter; label: string; count: number }[] = [
    { v: "new", label: "جدید", count: newCount },
    { v: "all", label: "همه", count: totalCount },
  ];

  return (
    <div className="r-pad" style={css`max-width:1180px;margin:0 auto;padding:30px 24px 64px`}>
      <AdminTabs active="leads" />

      <div className="r-wrap" style={css`display:flex;align-items:center;gap:14px;margin-bottom:20px;flex-wrap:wrap`}>
        <h1 style={css`margin:0;font-size:25px;font-weight:800`}>استعلام‌ها و درخواست مشاوره</h1>
        <span className="r-wrap-spacer" style={css`flex:1`}></span>
        <div style={css`display:flex;gap:8px`}>
          {filters.map((f) => (
            <Link
              key={f.v}
              href={f.v === "new" ? "/admin/leads" : "/admin/leads?filter=all"}
              style={css`border:1px solid ${filter === f.v ? teal : "#E3EAE8"};background:${filter === f.v ? "#E8F2F0" : "#fff"};color:${filter === f.v ? teal : "#3D5451"};padding:9px 16px;border-radius:9px;font-size:13.5px;font-weight:600`}
            >
              {f.label} ({faNum(f.count)})
            </Link>
          ))}
        </div>
      </div>

      <div style={css`display:grid;gap:12px`}>
        {leads.map((lead) => {
          const productName = lead.productSlug ? nameBySlug.get(lead.productSlug) : null;

          return (
            <div
              key={lead.id}
              style={css`background:#fff;border:1px solid ${lead.handled ? "#E3EAE8" : "#CDE2DE"};border-right:4px solid ${lead.handled ? "#E3EAE8" : "#EFA00B"};border-radius:14px;padding:18px 20px`}
            >
              <div className="r-wrap" style={css`display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px`}>
                {!lead.handled && (
                  <span
                    style={css`background:#EFA00B;color:#3A2600;border-radius:6px;padding:3px 9px;font-size:11.5px;font-weight:700`}
                  >
                    جدید
                  </span>
                )}
                <span style={css`font-size:16px;font-weight:700`}>{lead.name}</span>
                <span
                  style={css`background:#E8F2F0;color:#0F5B52;border-radius:6px;padding:3px 9px;font-size:12px;font-weight:600`}
                >
                  {lead.projectType}
                </span>
                <span className="r-wrap-spacer" style={css`flex:1`}></span>
                <span style={css`font-size:12.5px;color:#7C8F8C`}>{faDateTime(lead.createdAt)}</span>
              </div>

              {/* tel: so the admin can call straight from a phone. */}
              <div className="r-wrap" style={css`display:flex;gap:18px;flex-wrap:wrap;font-size:13.5px;margin-bottom:12px`}>
                <a href={`tel:${lead.phone}`} style={css`color:#0F5B52;font-weight:700;direction:ltr`}>
                  {lead.phone}
                </a>
                <span style={css`color:#5E7370`}>شهر: {lead.city}</span>
                {lead.company && <span style={css`color:#5E7370`}>شرکت: {lead.company}</span>}
              </div>

              {productName ? (
                <div
                  style={css`background:#F6F8F7;border:1px solid #E3EAE8;border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:13px`}
                >
                  <span style={css`color:#7C8F8C`}>درباره محصول: </span>
                  <Link href={`/product/${lead.productSlug}`} style={css`font-weight:600;color:#0F5B52`}>
                    {productName}
                  </Link>
                </div>
              ) : lead.productSlug ? (
                // The product was renamed or removed after the enquiry came in.
                <div
                  style={css`background:#F6F8F7;border:1px solid #E3EAE8;border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:13px;color:#7C8F8C`}
                >
                  درباره محصول: {lead.productSlug} (این محصول دیگر موجود نیست)
                </div>
              ) : null}

              {lead.message.trim() ? (
                <div
                  style={css`font-size:13.5px;line-height:1.95;color:#3D5451;white-space:pre-wrap;margin-bottom:14px;text-wrap:pretty`}
                >
                  {lead.message}
                </div>
              ) : (
                <div style={css`font-size:13px;color:#93A5A2;margin-bottom:14px`}>بدون توضیح</div>
              )}

              <div className="r-wrap" style={css`display:flex;align-items:center;gap:10px;flex-wrap:wrap`}>
                <form action={toggleLeadHandledAction}>
                  <input type="hidden" name="id" value={lead.id} />
                  <button
                    type="submit"
                    style={css`border:1px solid ${lead.handled ? "#CBD9D6" : "#0F5B52"};background:${lead.handled ? "#fff" : "#0F5B52"};color:${lead.handled ? "#3D5451" : "#fff"};padding:9px 16px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer`}
                  >
                    {lead.handled ? "بازگرداندن به جدید" : "علامت‌گذاری به‌عنوان انجام‌شده"}
                  </button>
                </form>
                <span className="r-wrap-spacer" style={css`flex:1`}></span>
                <DeleteLeadButton id={lead.id} />
              </div>
            </div>
          );
        })}

        {leads.length === 0 && (
          <div
            className="r-roomy"
            style={css`background:#fff;border:1px dashed #CBD9D6;border-radius:16px;padding:56px;text-align:center`}
          >
            <div style={css`font-size:16px;font-weight:700;margin-bottom:8px`}>
              {filter === "new" ? "استعلام جدیدی نیست" : "هنوز استعلامی ثبت نشده است"}
            </div>
            <div style={css`font-size:13.5px;color:#5E7370`}>
              {filter === "new"
                ? "همه استعلام‌ها بررسی شده‌اند. برای دیدن موارد قبلی «همه» را بزنید."
                : "وقتی کسی از صفحه محصول یا فرم مشاوره درخواستی بفرستد، اینجا نمایش داده می‌شود."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
