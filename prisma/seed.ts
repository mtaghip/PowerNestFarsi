import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "inv-hyb-5",
    name: "اینورتر هیبرید ۵ کیلووات مدل SPH 5000",
    brand: "Growatt",
    category: "اینورتر",
    price: 78_000_000,
    rating: 5,
    reviewCount: 41,
    stock: true,
    badge: "پرفروش",
    power: "۵ کیلووات",
    voltage: "۴۸ ولت DC",
    warranty: "۵ سال",
    extra: "MPPT دوگانه",
    description:
      "اینورتر هیبرید سه‌کاره برای سیستم‌های خانگی: اتصال به شبکه، شارژ باتری و تأمین بار در قطعی برق. با دو ورودی MPPT و پشتیبانی از اپلیکیشن مانیتورینگ.",
    image: "/img/prod-inv-hybrid.png",
  },
  {
    slug: "inv-ong-10",
    name: "اینورتر آنگرید ۱۰ کیلووات سه‌فاز SG10RT",
    brand: "Sungrow",
    category: "اینورتر",
    price: 132_000_000,
    rating: 5,
    reviewCount: 18,
    stock: true,
    badge: "سه‌فاز",
    power: "۱۰ کیلووات",
    voltage: "۳۸۰ ولت AC",
    warranty: "۱۰ سال",
    extra: "بازده ۹۸.۴٪",
    description:
      "اینورتر آنگرید سه‌فاز مناسب کارگاه و ساختمان‌های اداری، با بازده اروپایی ۹۸.۴٪ و قابلیت پایش تولید از راه دور.",
    image: "/img/prod-inv-3ph.png",
  },
  {
    slug: "bat-5",
    name: "باتری لیتیوم ۵ کیلووات‌ساعت مدل Hope 5.0L",
    brand: "Growatt",
    category: "باتری لیتیوم",
    price: 96_000_000,
    rating: 4,
    reviewCount: 27,
    stock: true,
    badge: "موجود",
    power: "۵ کیلووات‌ساعت",
    voltage: "۵۱.۲ ولت",
    warranty: "۱۰ سال",
    extra: "۶۰۰۰ سایکل",
    description:
      "باتری لیتیوم فسفات آهن با BMS داخلی و عمر بالای ۶۰۰۰ سایکل. قابل نصب دیواری و توسعه تا چهار ماژول موازی.",
    image: "/img/prod-bat-wall.png",
  },
  {
    slug: "bat-14",
    name: "باتری لیتیوم ۱۴.۳ کیلووات‌ساعت رک‌مونت HOPE 14.3L",
    brand: "Growatt",
    category: "باتری لیتیوم",
    price: 245_000_000,
    rating: 5,
    reviewCount: 12,
    stock: true,
    badge: "ظرفیت بالا",
    power: "۱۴.۳ کیلووات‌ساعت",
    voltage: "۵۱.۲ ولت",
    warranty: "۱۰ سال",
    extra: "رک ۱۹ اینچ",
    description:
      "بانک باتری رک‌مونت برای سیستم‌های خانگی بزرگ و تجاری کوچک، با مانیتورینگ سلولی و خنک‌کاری غیرفعال.",
    image: "/img/prod-bat-rack.png",
  },
  {
    slug: "bat-10",
    name: "باتری لیتیوم ۱۰ کیلووات‌ساعت پک صنعتی",
    brand: "Pylontech",
    category: "باتری لیتیوم",
    price: 178_000_000,
    rating: 4,
    reviewCount: 9,
    stock: false,
    badge: "ناموجود",
    power: "۱۰ کیلووات‌ساعت",
    voltage: "۵۱.۲ ولت",
    warranty: "۸ سال",
    extra: "IP55",
    description:
      "پک باتری صنعتی با درجه حفاظت IP55 برای نصب در محیط نیمه‌باز و ایستگاه‌های پمپاژ.",
    image: "/img/prod-bat-ind.png",
  },
  {
    slug: "pkg-3",
    name: "پکیج کامل خورشیدی خانگی ۳ کیلووات",
    brand: "Ashianeh",
    category: "سیستم کامل",
    price: 320_000_000,
    rating: 5,
    reviewCount: 63,
    stock: true,
    badge: "پیشنهاد ویژه",
    power: "۳ کیلووات",
    voltage: "۲۲۰ ولت",
    warranty: "۵ سال",
    extra: "با نصب",
    description:
      "پکیج آماده شامل شش پنل ۶۱۰ واتی، اینورتر هیبرید، باتری ۵ کیلووات‌ساعت، سازه و کابل‌کشی، همراه با نصب و راه‌اندازی.",
    image: "/img/prod-pkg-home.png",
  },
  {
    slug: "pkg-20",
    name: "پکیج صنعتی خورشیدی ۲۰ کیلووات سقف کارخانه",
    brand: "Ashianeh",
    category: "سیستم کامل",
    price: 1_850_000_000,
    rating: 5,
    reviewCount: 7,
    stock: true,
    badge: "صنعتی",
    power: "۲۰ کیلووات",
    voltage: "۳۸۰ ولت",
    warranty: "۱۰ سال",
    extra: "با پیش‌فاکتور رسمی",
    description:
      "راهکار کامل کاهش هزینه برق صنعتی: آرایه ۳۳ پنلی، اینورتر سه‌فاز، پایش تولید و امکان قرارداد خرید تضمینی برق مازاد.",
    image: "/img/prod-pkg-ind.png",
  },
  {
    slug: "wind-3",
    name: "توربین بادی ۳ کیلووات محور افقی",
    brand: "Windzilla",
    category: "توربین بادی",
    price: 210_000_000,
    rating: 4,
    reviewCount: 5,
    stock: true,
    badge: "جدید",
    power: "۳ کیلووات",
    voltage: "۴۸ ولت DC",
    warranty: "۳ سال",
    extra: "باد شروع ۲.۵ m/s",
    description:
      "توربین بادی کوچک برای مناطق بادخیز و سیستم‌های ترکیبی خورشید-باد، با پره‌های کامپوزیت و ترمز الکترومغناطیسی.",
    image: "/img/prod-wind.png",
  },
  {
    slug: "ev-11",
    name: "شارژر خودرو برقی ۱۱ کیلووات دیواری",
    brand: "Zaptec",
    category: "شارژر خودرو برقی",
    price: 62_000_000,
    rating: 5,
    reviewCount: 22,
    stock: true,
    badge: "هوشمند",
    power: "۱۱ کیلووات",
    voltage: "۳۸۰ ولت AC",
    warranty: "۳ سال",
    extra: "Type 2 · اپلیکیشن",
    description:
      "شارژر هوشمند دیواری با کنترل مصرف، زمان‌بندی شارژ در ساعات کم‌باری و هماهنگی با تولید پنل خورشیدی.",
    image: "/img/prod-ev.png",
  },
  {
    slug: "sw-300",
    name: "آبگرمکن خورشیدی ۳۰۰ لیتری لوله خلأ",
    brand: "Sunrise",
    category: "آبگرمکن خورشیدی",
    price: 48_000_000,
    rating: 4,
    reviewCount: 31,
    stock: true,
    badge: "کم‌هزینه",
    power: "۳۰۰ لیتر",
    voltage: "—",
    warranty: "۵ سال",
    extra: "۲۴ لوله خلأ",
    description:
      "آبگرمکن خورشیدی با مخزن استیل و لوله‌های خلأ، مناسب خانه چهار تا شش نفره؛ بدون مصرف برق.",
    image: "/img/prod-heater.png",
  },
  {
    slug: "pump-15",
    name: "پمپ آب خورشیدی ۱.۵ کیلووات چاه عمیق",
    brand: "Lorentz",
    category: "پمپ آب خورشیدی",
    price: 71_000_000,
    rating: 4,
    reviewCount: 14,
    stock: true,
    badge: "کشاورزی",
    power: "۱.۵ کیلووات",
    voltage: "۷۲ ولت DC",
    warranty: "۲ سال",
    extra: "ارتفاع ۸۰ متر",
    description:
      "پمپ شناور DC با درایو خورشیدی، بدون نیاز به باتری؛ برای آبیاری و آبرسانی دام در مناطق دور از شبکه.",
    image: "/img/prod-pump.png",
  },
  {
    slug: "pkg-camp",
    name: "پکیج برق خورشیدی کمپر و آفرود ۱.۵ کیلووات",
    brand: "Ashianeh",
    category: "سیستم کامل",
    price: 96_000_000,
    rating: 4,
    reviewCount: 38,
    stock: true,
    badge: "سفری",
    power: "۱.۵ کیلووات",
    voltage: "۱۲ ولت DC",
    warranty: "۲ سال",
    extra: "قابل حمل",
    description:
      "مجموعه قابل حمل شامل پنل تاشو، اینورتر ۲۰۰۰ وات، باتری ۱۰۰ آمپرساعت و شارژر خودرو برای سفر و کمپینگ.",
    image: "/img/prod-camp.png",
  },
];

const genericReviews = [
  { author: "مهدی ر.", rating: 5, comment: "دو ماه است نصب شده. در قطعی‌های تابستان کل خانه بدون وقفه کار کرد. تنظیم اپلیکیشن ساده بود." },
  { author: "شرکت آریا صنعت", rating: 5, comment: "برای کارگاه ۶۰۰ متری گرفتیم. پیش‌فاکتور رسمی سریع صادر شد و نصب طبق زمان‌بندی انجام شد." },
  { author: "سحر ک.", rating: 4, comment: "کیفیت کالا خوب است. ارسال یک روز دیرتر از موعد رسید ولی پشتیبانی مرتب اطلاع می‌داد." },
];

async function main() {
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    const existing = await prisma.review.count({ where: { productId: product.id } });
    if (existing === 0) {
      await prisma.review.createMany({
        data: genericReviews.map((r) => ({ ...r, productId: product.id })),
      });
    }
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
