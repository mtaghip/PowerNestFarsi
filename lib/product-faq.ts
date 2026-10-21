/**
 * Product FAQs, keyed by product slug. Kept in code rather than the database
 * for the same reason the blog is: it is long-form copy that changes rarely,
 * and keeping it here avoids a schema migration for a feature only one
 * product uses so far. Add an entry for another slug to give it a FAQ.
 *
 * Every figure in an answer must come from that product's datasheet (the
 * `specs` rows in lib/seed-data.ts) or be plain arithmetic on those figures.
 * Where the honest answer depends on the customer's equipment — inverter
 * compatibility above all — say so and send them to a consultation rather
 * than guessing.
 */

export interface FaqItem {
  q: string;
  a: string;
  /** Optional internal link shown under the answer. */
  link?: { href: string; label: string };
}

export const PRODUCT_FAQ: Record<string, FaqItem[]> = {
  "hope-5-5l-a1": [
    {
      q: "ظرفیت واقعی قابل استفاده باتری گرووات Hope 5.5L-A1 چقدر است؟",
      a: "ظرفیت اسمی این باتری ۵.۵ کیلووات ساعت و ظرفیت قابل استفاده آن ۵.۱۲ کیلووات ساعت است. این تفاوت به دلیل عمق دشارژ ۹۳٪ است: سیستم مدیریت باتری اجازه نمی‌دهد سلول‌ها کاملاً خالی شوند تا عمر باتری حفظ شود.",
    },
    {
      q: "«۱۰۰ آمپر» در مشخصات این باتری به چه معناست؟",
      a: "حداکثر جریان پیوسته شارژ و دشارژ باتری ۱۰۰ آمپر است. در ولتاژ نامی ۵۱.۲ ولت، این یعنی باتری می‌تواند به‌طور پیوسته حدود ۵.۱ کیلووات توان بدهد یا بگیرد. جریان پیک دشارژ ۱۲۰ آمپر به مدت ۳ ثانیه است که برای راه‌اندازی بارهای با جریان هجومی کوتاه کافی است.",
    },
    {
      q: "یک باتری Hope 5.5L-A1 چند ساعت برق می‌دهد؟",
      a: "به مصرف شما بستگی دارد. با ۵.۱۲ کیلووات ساعت انرژی قابل استفاده، یک بار ثابت ۱ کیلوواتی را حدود ۵ ساعت و یک بار ۵۰۰ واتی را حدود ۱۰ ساعت تأمین می‌کند. تلفات اینورتر را هم در نظر بگیرید که معمولاً چند درصد از این زمان کم می‌کند.",
      link: { href: "/calculator", label: "محاسبه ظرفیت باتری موردنیاز شما" },
    },
    {
      q: "این باتری با چه اینورترهایی کار می‌کند؟",
      a: "این باتری ۵۱.۲ ولتی است، در محدوده ولتاژ ۴۰ تا ۵۸.۴ ولت کار می‌کند و از طریق پورت‌های CAN و RS485 با اینورتر ارتباط برقرار می‌کند. سازگاری با هر اینورتر به پشتیبانی آن از پروتکل ارتباطی باتری بستگی دارد؛ مدل اینورتر خود را برای ما بفرستید تا پیش از خرید سازگاری را بررسی کنیم.",
      link: { href: "/consult?product=hope-5-5l-a1", label: "استعلام سازگاری با اینورتر" },
    },
    {
      q: "آیا می‌توان چند باتری Hope 5.5L-A1 را با هم موازی کرد؟",
      a: "بله. تا ۱۲ پک را می‌توان به‌صورت موازی به هم وصل کرد که ظرفیت اسمی کل را به ۶۶ کیلووات ساعت می‌رساند. می‌توانید با یک یا دو پک شروع کنید و در صورت نیاز بعداً ظرفیت را افزایش دهید.",
    },
    {
      q: "باتری را کجا باید نصب کرد؟",
      a: "درجه حفاظت این باتری IP20 است، یعنی تجهیزی داخلی است و باید در فضای سرپوشیده، دور از آب، گرد و غبار و تابش مستقیم آفتاب نصب شود. محدوده دمای مجاز شارژ ۰ تا ۵۵+ درجه و دشارژ ۲۰− تا ۵۵+ درجه سانتی‌گراد است. محل خنک و دارای تهویه، عمر باتری را به‌طور محسوسی بیشتر می‌کند.",
      link: { href: "/blog/lifepo4-battery-heat", label: "راهنمای نصب باتری لیتیوم در گرمای تابستان" },
    },
    {
      q: "ابعاد و وزن باتری چقدر است؟",
      a: "بدنه این باتری رک‌مونت است، با ابعاد ۴۴۰ میلی‌متر عرض، ۵۴۰ میلی‌متر عمق و ۱۳۰.۵ میلی‌متر ارتفاع، و وزن آن ۴۵ کیلوگرم (۱± کیلوگرم) است.",
    },
    {
      q: "گارانتی و عمر باتری چقدر است؟",
      a: "باتری ۵ سال گارانتی دارد و عمر آن بیش از ۶۰۰۰ سیکل شارژ و دشارژ است (در دمای ۲۵ درجه و جریان ۰.۲C). استانداردهای CE (EMC)، UN38.3، MSDS و RoHS را دارد.",
    },
  ],
};

export function getProductFaq(slug: string): FaqItem[] {
  return PRODUCT_FAQ[slug] ?? [];
}
