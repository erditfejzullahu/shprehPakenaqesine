import { z } from "zod";

const BLOB_HOST = ".blob.vercel-storage.com";

export function isAllowedAssetUrl(url: string): boolean {
  if (url.startsWith("/uploads/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url.includes(BLOB_HOST);
  }
  return false;
}

export const blobUrlSchema = z
  .string()
  .url("URL e skedarit jo valid")
  .refine(isAllowedAssetUrl, "URL e skedarit nuk është e autorizuar");

export const blobUrlArraySchema = z.array(blobUrlSchema);
