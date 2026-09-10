/**
 * Single source of truth for the business's public contact details.
 *
 * These used to be typed inline in the header, footer and consult page, which
 * meant changing the number was a hunt through three files with four copies
 * between them. Import from here instead.
 */

/**
 * Shown to visitors, in Persian numerals.
 *
 * Render it inside `direction:ltr;unicode-bidi:isolate`. The whole site is
 * dir="rtl", and the hyphen here is a bidi-neutral character between two
 * number runs, so without that isolation the browser lays the two halves out
 * right-to-left and the number reads back to front as ۴۳۷۳۵۵۶-۰۹۳۰.
 */
export const PHONE_DISPLAY = "۰۹۳۰-۴۳۷۳۵۵۶";

/** For `tel:` and `wa.me` links, which need plain digits. */
export const PHONE_E164 = "+989304373556";

export const EMAIL = "sales@ashianeh.energy";

export const OFFICE_HOURS = "شنبه تا چهارشنبه ۹ تا ۱۸ · پنجشنبه ۹ تا ۱۳";
