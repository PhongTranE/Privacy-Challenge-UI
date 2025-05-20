export interface FileResponse {
  id: number;
  filename: string;
  originalFilename: string;
  uploadedAt: string;
  isActive: boolean;
  creatorId: number;
}

export type FileListResponseData = FileResponse[];

export interface UploadFileResponseData {
  filePath: string;
  extractedFilePath: string;
  fileId: number;
}

// Khi lỗi file trùng tên, data sẽ là { filename: string }
export interface DuplicateFileResponseData {
  filename: string;
}