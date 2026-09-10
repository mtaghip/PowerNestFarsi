import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { css } from "@/lib/css";
import { posts, getPost, type BlogBlock } from "@/lib/blog";

const teal = "#0F5B52";

// The posts are static, so pre-render all of them at build time.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "مقاله پیدا نشد | آشیانه انرژی" };

  return {
    title: `${post.title} | آشیانه انرژی`,
    description: post.desc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.desc,
      type: "article",
      images: [post.image],
    },
  };
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.t) {
    case "h":
      return (
        <h2 style={css`margin:34px 0 14px;font-size:20px;font-weight:800;line-height:1.6;color:#12211F`}>
          {block.text}
        </h2>
      );

    case "p":
      return (
        <p style={css`margin:0 0 18px;font-size:15.5px;line-height:2.1;color:#3D5451;text-wrap:pretty`}>{block.text}</p>
      );

    case "ul":
      return (
        <ul style={css`margin:0 0 18px;padding-right:20px;display:grid;gap:10px`}>
          {block.items.map((item, i) => (
            <li key={i} style={css`font-size:15px;line-height:2;color:#3D5451;text-wrap:pretty`}>
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol style={css`margin:0 0 18px;padding-right:20px;display:grid;gap:10px`}>
          {block.items.map((item, i) => (
            <li key={i} style={css`font-size:15px;line-height:2;color:#3D5451;text-wrap:pretty`}>
              {item}
            </li>
          ))}
        </ol>
      );

    case "note":
      return (
        <div
          style={css`background:#E8F2F0;border:1px solid #CDE2DE;border-right:4px solid #0F5B52;border-radius:12px;padding:16px 18px;margin:0 0 20px;font-size:14.5px;line-height:2;color:#0A3F39;text-wrap:pretty`}
        >
          {block.text}
        </div>
      );

    case "table":
      return (
        // Tables are the one thing that cannot reflow on a phone, so this
        // scrolls sideways inside its own box instead.
        <div className="r-scroll" style={css`margin:0 0 22px;border:1px solid #E3EAE8;border-radius:12px`}>
          <table style={css`width:100%;border-collapse:collapse;font-size:14px;min-width:340px`}>
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    style={css`text-align:right;padding:12px 16px;background:#F6F8F7;font-weight:700;color:#12211F;border-bottom:1px solid #E3EAE8;white-space:nowrap`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={css`padding:12px 16px;border-bottom:1px solid #EDF2F1;color:#3D5451;line-height:1.8`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="r-pad" style={css`max-width:820px;margin:0 auto;padding:26px 24px 64px`}>
      <div style={css`font-size:13px;color:#7C8F8C;margin-bottom:18px`}>
        <Link href="/" style={css`color:#7C8F8C`}>
          خانه
        </Link>{" "}
        /{" "}
        <Link href="/blog" style={css`color:#7C8F8C`}>
          آموزش و وبلاگ
        </Link>{" "}
        / {post.cat}
      </div>

      <article>
        <div style={css`display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px`}>
          <span
            style={css`background:#E8F2F0;color:#0F5B52;font-size:12.5px;font-weight:600;padding:5px 12px;border-radius:6px`}
          >
            {post.cat}
          </span>
          <span style={css`font-size:12.5px;color:#7C8F8C`}>
            {post.read} مطالعه · {post.date}
          </span>
        </div>

        <h1 style={css`margin:0 0 16px;font-size:31px;font-weight:800;line-height:1.5;letter-spacing:-.3px;text-wrap:pretty`}>
          {post.title}
        </h1>

        <p style={css`margin:0 0 26px;font-size:17px;line-height:2;color:#5E7370;text-wrap:pretty`}>{post.desc}</p>

        <div
          className="r-hero-media"
          style={css`position:relative;height:340px;border-radius:16px;overflow:hidden;background:#F0F4F3;margin-bottom:32px`}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 860px) 100vw, 820px"
            priority
          />
        </div>

        <div>
          {post.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>

      <div
        className="r-split r-roomy"
        style={css`background:#0F5B52;border-radius:18px;padding:28px;margin:40px 0 36px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:center;color:#fff`}
      >
        <div>
          <div style={css`font-size:18px;font-weight:800;margin-bottom:8px`}>سؤالی درباره سیستم خودتان دارید؟</div>
          <div style={css`font-size:14px;line-height:1.9;color:#C9DFDB;text-wrap:pretty`}>
            کارشناس فنی آشیانه مصرف و محل نصب شما را بررسی می‌کند و طرح فنی با اعداد واقعی می‌دهد. مشاوره اولیه رایگان
            است.
          </div>
        </div>
        <Link
          href="/consult"
          style={css`border:0;background:#EFA00B;color:#3A2600;padding:14px 26px;border-radius:11px;font-size:15px;font-weight:700;white-space:nowrap;text-align:center`}
        >
          درخواست مشاوره
        </Link>
      </div>

      <div>
        <div style={css`font-size:18px;font-weight:700;margin-bottom:16px`}>مقالات مرتبط</div>
        <div className="r-cards-3" style={css`display:grid;grid-template-columns:repeat(3,1fr);gap:16px`}>
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              style={css`background:#fff;border:1px solid #E3EAE8;border-radius:16px;overflow:hidden;display:block`}
            >
              <div style={css`height:130px;background:#F0F4F3;position:relative`}>
                <Image src={r.image} alt={r.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 820px) 50vw, 260px" />
              </div>
              <div style={css`padding:16px`}>
                <div style={css`font-size:11.5px;color:#7C8F8C;margin-bottom:8px`}>
                  {r.cat} · {r.read}
                </div>
                <div style={css`font-size:14.5px;font-weight:700;line-height:1.7;color:#12211F;text-wrap:pretty`}>
                  {r.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={css`margin-top:28px`}>
        <Link href="/blog" style={css`font-size:14px;font-weight:600;color:${teal}`}>
          → بازگشت به همه مقالات
        </Link>
      </div>
    </div>
  );
}
