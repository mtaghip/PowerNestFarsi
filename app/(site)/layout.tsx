import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareTray from "@/components/CompareTray";
import { getCartCount } from "@/lib/cart";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cartCount = await getCartCount();

  return (
    <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header cartCount={cartCount} />
      <main style={{ flex: 1 }}>{children}</main>
      <CompareTray />
      <Footer />
    </div>
  );
}
