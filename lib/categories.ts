export interface Category {
  /** Persian display name, also the value stored in Product.category. */
  name: string;
  /** URL segment for /shop/[slug]. Latin, so the URL survives being copied. */
  slug: string;
  image: string;
  /** Short introduction shown at the top of the category page. */
  intro: string;
}

export const CATEGORIES: Category[] = [
  {
    name: "اینورتر",
    slug: "inverter",
    image: "/img/prod-inv-hybrid.png",
    intro:
      "اینورتر برق مستقیم پنل‌های خورشیدی و باتری را به برق متناوب قابل استفاده در ساختمان تبدیل می‌کند. اینورتر آنگرید تولید پنل را مستقیم به شبکه و مصرف ساختمان می‌دهد؛ اینورتر هیبرید علاوه بر آن باتری را مدیریت می‌کند و در قطعی برق، پشتیبان می‌دهد.",
  },
  {
    name: "باتری لیتیوم",
    slug: "lithium-battery",
    image: "/img/prod-bat-wall.png",
    intro:
      "باتری‌های لیتیوم فسفات آهن (LiFePO4) برای ذخیره انرژی خورشیدی و پشتیبان برق در قطعی شبکه. در مقایسه با باتری سرب‌اسید، عمر سیکل بسیار بیشتر، عمق دشارژ بالاتر و نگهداری کمتری دارند. ظرفیت، جریان شارژ و دشارژ و سازگاری ارتباطی با اینورتر را پیش از خرید بررسی کنید.",
  },
  {
    name: "سیستم کامل",
    slug: "solar-package",
    image: "/img/prod-pkg-home.png",
    intro:
      "پکیج‌های کامل خورشیدی شامل پنل، اینورتر، باتری و تجهیزات حفاظتی که برای کار با هم انتخاب شده‌اند. پیش از خرید، با ماشین‌حساب انرژی یا مشاوره رایگان، اندازه پکیج را با مصرف واقعی خود تطبیق دهید.",
  },
  {
    name: "توربین بادی",
    slug: "wind-turbine",
    image: "/img/prod-wind.png",
    intro:
      "توربین‌های بادی کوچک برای مناطقی که باد پایدار دارند، به‌تنهایی یا در کنار پنل خورشیدی. تولید توربین به‌شدت به سرعت باد محل بستگی دارد؛ بررسی داده باد منطقه پیش از خرید ضروری است.",
  },
  {
    name: "شارژر خودرو برقی",
    slug: "ev-charger",
    image: "/img/prod-ev.png",
    intro:
      "شارژرهای دیواری خودرو برقی برای منزل و پارکینگ. توان شارژر را با ظرفیت انشعاب برق ساختمان و توان پذیرش شارژ خودرو هماهنگ کنید.",
  },
  {
    name: "آبگرمکن خورشیدی",
    slug: "solar-water-heater",
    image: "/img/prod-heater.png",
    intro:
      "آبگرمکن‌های خورشیدی گرمای خورشید را مستقیم برای تأمین آب گرم مصرفی به کار می‌گیرند و مصرف گاز یا برق برای گرمایش آب را کاهش می‌دهند.",
  },
  {
    name: "پمپ آب خورشیدی",
    slug: "solar-pump",
    image: "/img/prod-pump.png",
    intro:
      "پمپ‌های آب خورشیدی برای چاه و آبیاری کشاورزی، بدون نیاز به برق شبکه یا سوخت. انتخاب درست پمپ به ارتفاع کل، دبی موردنیاز و ساعات تابش محل بستگی دارد.",
  },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByName(name: string | undefined): Category | undefined {
  return name ? CATEGORIES.find((c) => c.name === name) : undefined;
}

/**
 * Link to a category page. Falls back to the shop for a category name that
 * is not in the list — an admin can type any category on a product.
 */
export function categoryHref(name: string): string {
  const c = categoryByName(name);
  return c ? `/shop/${c.slug}` : "/shop";
}
