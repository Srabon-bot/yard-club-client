/* ImgBB is the documented upload host. Other direct image links are served
   as-is so arbitrary external URLs never pass through the image optimizer. */
export function bypassImageOptimization(src: string) {
  if (!/^https?:\/\//i.test(src)) return false;

  try {
    const url = new URL(src);
    return !(url.protocol === "https:" && url.hostname === "i.ibb.co");
  } catch {
    return true;
  }
}
