import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import mime from 'mime-types';

type EntityType = 
    'complaints/attachments' 
    | 'complaints/audiosAttached' 
    | 'complaints/videosAttached' 
    | 'companys/images'
    | 'companys/logo' 
    | 'users' 
    | 'reports/attachments'
    | 'reports/audiosAttached' 
    | 'reports/videosAttached';

interface FileValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  data?: Buffer
}

interface UploadResult {
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
    ])
    
    private readonly validVideoTypes: Set<string> = new Set([
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo'
    ])

    private readonly validDocumentTypes: Set<string> = new Set([
      'application/pdf',
      'application/msword',  // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
      'application/vnd.ms-excel',  // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
      'application/vnd.ms-powerpoint',  // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'  // .pptx
  ]);

    private readonly maxFileSize: number = 50 * 1024 * 1024; // 50 mb

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
          
          if (!isValidImage && !isValidVideo && !isValidDoc) {
            return { valid: false, error: 'Unsupported file type' };
          }
    
          return { valid: true, mimeType, data };
        } catch (error) {
          return { valid: false, error: error instanceof Error ? error.message : 'Invalid file data' };
        }
      }

    private getFileExtension(mimeType: string): string {
        if (this.validImageTypes.has(mimeType)) {
          return 'webp'; // Convert all images to webp
        }
        return mime.extension(mimeType) || 'bin';
    }

    private async saveFile(
        buffer: Buffer,
        entityType: EntityType,
        entityId: string,
        mimeType: string
      ): Promise<UploadResult> {
        // Validate entity type

    const entityTypes: string[] = ['complaints/attachments', 'complaints/audiosAttached', 'complaints/videosAttached', 'companys/images', 'companys/logo', 'users', 'reports/attachments', 'reports/audiosAttached', 'reports/videosAttached']
        if (!entityTypes.includes(entityType)) {
          throw new Error('Invalid entity type');
        }
    
        // Create directory path
        const baseDir = path.join(process.cwd(), 'public', 'uploads', `${entityType}`, entityId);
        await fs.mkdir(baseDir, { recursive: true });
    
        // Generate unique filename
        const fileExtension = this.getFileExtension(mimeType);
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const filePath = path.join(baseDir, uniqueFileName);
    
        // Process and save file
        if (this.validImageTypes.has(mimeType)) {
          // Convert image to WebP
          await sharp(buffer)
            .webp({ quality: 80 })
            .toFile(filePath);
        } else {
          // Save video directly
          await fs.writeFile(filePath, buffer);
        }
    
        // Return public URL
        const publicUrl = `/uploads/${entityType}/${entityId}/${uniqueFileName}`;
        return {
          success: true,
          url: publicUrl,
          fileName: uniqueFileName,
          filePath,
          mimeType: this.validImageTypes.has(mimeType) ? 'image/webp' : mimeType,
        };
    }

    public async uploadFile(
        base64Data: string,
        entityType: EntityType,
        entityId: string
      ): Promise<UploadResult> {
        // Validate file and extract data
        const validation = this.validateFile(base64Data);
        if (!validation.valid || !validation.mimeType || !validation.data) {
          throw new Error(validation.error || 'Invalid file');
        }
    
        // Save file
        return this.saveFile(validation.data, entityType, entityId, validation.mimeType);
    }

    public async deleteFile(filePath: string): Promise<boolean> {
        try {
          await fs.unlink(filePath);
          return true;
        } catch (error) {
          console.error('File deletion error:', error);
          throw error;
        }
    }
}

export const fileUploadService = new FileUploadService();