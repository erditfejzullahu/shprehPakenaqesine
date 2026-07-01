"use client";

import type { FileUploadFolder } from "@/services/fileUploadService";

const UPLOAD_FILE_URL = "/api/blob/uploadFile";

export async function uploadFileToBlob(
  file: File,
  folder: FileUploadFolder,
  entityId: string
): Promise<string> {
  const pathname = `${folder}/${entityId}/${Date.now()}-${file.name}`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("pathname", pathname);

  const response = await fetch(UPLOAD_FILE_URL, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string"
        ? payload.error
        : "Ngarkimi i skedarit dështoi."
    );
  }

  if (typeof payload.url !== "string") {
    throw new Error("Ngarkimi i skedarit dështoi.");
  }

  return payload.url;
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
  folderPrefix: "complaints" | "contributions" | "reports" = "complaints"
) {
  const [attachments, audiosAttached, videosAttached] = await Promise.all([
    uploadFilesToBlob(
      attachmentFiles,
      `${folderPrefix}/attachments` as FileUploadFolder,
      entityId
    ),
    uploadFilesToBlob(
      audioFiles,
      `${folderPrefix}/audiosAttached` as FileUploadFolder,
      entityId
    ),
    uploadFilesToBlob(
      videoFiles,
      `${folderPrefix}/videosAttached` as FileUploadFolder,
      entityId
    ),
  ]);
  return { attachments, audiosAttached, videosAttached };
}
