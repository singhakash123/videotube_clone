import { fileUploader } from "./fileUploaderSingle.js";

/**
 * Upload multiple files using the single-file uploader
 */
export const multiFileUploader = async function (filePaths = []) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) return [];

  const uploadedFiles = [];
  for (const path of filePaths) {
    try {
      const file = await fileUploader(path);
      uploadedFiles.push(file);
    } catch (error) {
      console.error(`Failed to upload ${path}:`, error.message);
    }
  }

  return uploadedFiles;
};
