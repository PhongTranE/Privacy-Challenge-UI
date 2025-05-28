import axiosInstance from "@/services/axiosInstance";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { downloadBlobFile } from "@/utils/downloadBlobFile";


export const checkActiveRawFile = async (): Promise<void> => {
  const res = await axiosInstance.get<APIResponse<null>>("/anonym/check-active-rawfile");
  if (res.data.status === "success") {
    return;
  }
  throw new Error(res.data.message as string);
};

export const downloadRawFile = async (): Promise<void> => {
  const res = await axiosInstance.get("/anonym/download-rawfile", {
    responseType: "blob",
  });
  const contentDisposition = res.headers["content-disposition"];
  downloadBlobFile(res.data, contentDisposition, "rawfile.zip");
};
