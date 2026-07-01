"use client";

import { upload } from "@vercel/blob/client";
import type { FileUploadFolder } from "@/services/fileUploadService";

const HANDLE_UPLOAD_URL = "/api/blob/upload";

export async function uploadFileToBlob(
  file: File,
  folder: FileUploadFolder,
  entityId: string
): Promise<string> {
  const pathname = `${folder}/${entityId}/${Date.now()}-${file.name}`;
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: HANDLE_UPLOAD_URL,
  });
  return blob.url;
}

export async function uploadFilesToBlob(
  files: File[],
  folder: FileUploadFolder,
  entityId: string
): Promise<string[]> {
  if (files.length === 0) return [];
  return Promise.all(files.map((file) => uploadFileToBlob(file, folder, entityId)));
}

export async function uploadEvidenceFiles(
  entityId: string,
  attachmentFiles: File[],
  audioFiles: File[],
  videoFiles: File[],
  folderPrefix: "complaints" | "reports" = "complaints"
) {
  const [attachments, audiosAttached, videosAttached] = await Promise.all([
    uploadFilesToBlob(attachmentFiles, `${folderPrefix}/attachments` as FileUploadFolder, entityId),
    uploadFilesToBlob(audioFiles, `${folderPrefix}/audiosAttached` as FileUploadFolder, entityId),
    uploadFilesToBlob(videoFiles, `${folderPrefix}/videosAttached` as FileUploadFolder, entityId),
  ]);
  return { attachments, audiosAttached, videosAttached };
}
