import { del, put } from '@vercel/blob';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

export type FileUploadFolder =
    'complaints/attachments'
    | 'complaints/audiosAttached'
    | 'complaints/videosAttached'
    | 'companys/images'
    | 'companys/logo'
    | 'users'
    | 'reports/attachments'
    | 'reports/audiosAttached'
    | 'reports/videosAttached'
    | 'contactUs';

interface FileValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  data?: Buffer;
}

export interface UploadResult {
  success: boolean;
  url: string;
  fileName: string;
  filePath: string;
  mimeType: string;
}

class FileUploadService {
    private readonly validImageTypes: Set<string> = new Set([
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'image/gif',
    ]);

    private readonly validVideoTypes: Set<string> = new Set([
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
    ]);

    private readonly validAudioTypes: Set<string> = new Set([
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/mpeg',
    ]);

    private readonly validDocumentTypes: Set<string> = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ]);

    private readonly maxFileSize: number = 50 * 1024 * 1024;

    private readonly entityTypes: FileUploadFolder[] = [
        'complaints/attachments',
        'complaints/audiosAttached',
        'complaints/videosAttached',
        'companys/images',
        'companys/logo',
        'users',
        'reports/attachments',
        'reports/audiosAttached',
        'reports/videosAttached',
        'contactUs',
    ];

    private parseBase64(base64Data: string): { mimeType: string; data: Buffer } {
        const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new Error('Invalid base64 format');
        }

        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');

        return { mimeType, data: buffer };
    }

    private validateFile(base64Data: string): FileValidationResult {
        if (!base64Data) {
          return { valid: false, error: 'Missing file data' };
        }

        try {
          const { mimeType, data } = this.parseBase64(base64Data);

          if (data.length > this.maxFileSize) {
            return { valid: false, error: 'File size exceeds maximum limit' };
          }

          const isValidImage = this.validImageTypes.has(mimeType);
          const isValidVideo = this.validVideoTypes.has(mimeType);
          const isValidDoc = this.validDocumentTypes.has(mimeType);
          const isValidAudio = this.validAudioTypes.has(mimeType);

          if (!isValidImage && !isValidVideo && !isValidDoc && !isValidAudio) {
            return { valid: false, error: 'Unsupported file type' };
          }

          return { valid: true, mimeType, data };
        } catch (error) {
          return { valid: false, error: error instanceof Error ? error.message : 'Invalid file data' };
        }
    }

    private getFileExtension(mimeType: string): string {
        if (this.validImageTypes.has(mimeType)) {
          return 'webp';
        }
        return mime.extension(mimeType) || 'bin';
    }

    private async saveFile(
        buffer: Buffer,
        entityType: FileUploadFolder,
        entityId: string,
        mimeType: string
    ): Promise<UploadResult> {
        if (!this.entityTypes.includes(entityType)) {
          throw new Error('Invalid entity type');
        }

        const fileExtension = this.getFileExtension(mimeType);
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const pathname = `${entityType}/${entityId}/${uniqueFileName}`;

        let body: Buffer = buffer;
        let contentType = mimeType;

        if (this.validImageTypes.has(mimeType)) {
          body = await sharp(buffer).webp({ quality: 80 }).toBuffer();
          contentType = 'image/webp';
        }

        const blob = await put(pathname, body, {
          access: 'public',
          contentType,
          addRandomSuffix: false,
        });

        return {
          success: true,
          url: blob.url,
          fileName: uniqueFileName,
          filePath: blob.pathname,
          mimeType: contentType,
        };
    }

    public async uploadFile(
        base64Data: string,
        entityType: FileUploadFolder,
        entityId: string
    ): Promise<UploadResult> {
        const validation = this.validateFile(base64Data);
        if (!validation.valid || !validation.mimeType || !validation.data) {
          throw new Error(validation.error || 'Invalid file');
        }

        return this.saveFile(validation.data, entityType, entityId, validation.mimeType);
    }

    public async deleteFile(url: string): Promise<boolean> {
        try {
          await del(url);
          return true;
        } catch (error) {
          console.error('File deletion error:', error);
          throw error;
        }
    }
}

export const fileUploadService = new FileUploadService();
