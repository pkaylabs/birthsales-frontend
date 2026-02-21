import { BASE_URL } from "@/constants";

const isAbsoluteUrl = (value: string): boolean =>
  /^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:");

export const resolveImageUrl = (value?: string | null): string => {
  if (!value) return "";
  if (isAbsoluteUrl(value)) return value;
  if (value.startsWith(BASE_URL)) return value;

  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${base}${path}`;
};

const firstString = (v: unknown): string | undefined => {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    const found = v.find((x) => typeof x === "string");
    return typeof found === "string" ? found : undefined;
  }
  return undefined;
};

export const resolveProductImageUrl = (product: unknown): string => {
  if (!product || typeof product !== "object") return "";
  const record = product as Record<string, unknown>;

  const image = firstString(record.image);
  const mainImageUrl = firstString(record.main_image_url);
  const mainImageURL = firstString(record.mainImageUrl);

  return resolveImageUrl(image ?? mainImageUrl ?? mainImageURL ?? "");
};
