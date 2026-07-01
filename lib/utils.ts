import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetUrl(storedUrl: string | null | undefined): string {
  if (!storedUrl) return '';
  if (storedUrl.startsWith('http://') || storedUrl.startsWith('https://')) {
    return storedUrl;
  }
  if (storedUrl.startsWith('/uploads')) {
    return `/serve${storedUrl}`;
  }
  return `/serve/${storedUrl}`;
}

export function getAbsoluteAssetUrl(storedUrl: string | null | undefined): string {
  const url = getAssetUrl(storedUrl);
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${base}${url}`;
}

export function copyToClipboard(text: string) {
  if(navigator.clipboard){
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
  toast.success('Artikulli u kopjuar me sukses')
}

export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  return `data:${contentType};base64,${base64}`;
}
