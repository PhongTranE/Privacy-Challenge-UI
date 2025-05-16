export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = [
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "application/x-zip",
  "multipart/x-zip"
];

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

export const validateUploadFile = (file: File) => {
  if (!file) {
    throw new FileValidationError("No file selected");
  }

  // Check if file is a ZIP by extension or MIME type
  const isZipByExtension = file.name.toLowerCase().endsWith('.zip');
  const isZipByMimeType = ALLOWED_FILE_TYPES.includes(file.type);

  if (!isZipByExtension && !isZipByMimeType) {
    throw new FileValidationError("Only ZIP files are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError("File size must be less than 50MB");
  }
}; 