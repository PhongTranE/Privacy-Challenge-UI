import { UploadFileResponseData } from "@/types/api/responses/admin/uploadFileResponses";
import axios from "axios";
import axiosInstance from "@/services/axiosInstance";

export const uploadFile = async (
  file: File
): Promise<UploadFileResponseData> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axiosInstance.post("/admin/upload", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Có response từ server (ví dụ 413)
        throw new Error(error.response.data?.message || `Request failed with status code ${error.response.status}`);
      } else if (error.request) {
        // Không nhận được response (network error)
        throw new Error("Network Error");
      } else {
        // Lỗi khác
        throw new Error(error.message);
      }
    }
    throw new Error("Failed to upload file");
  }
};
