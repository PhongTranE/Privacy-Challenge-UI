import axiosInstance from "@/services/axiosInstance";
import { APIResponse } from "@/types/api/responses/responseTypes";


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
  // Get filename from Content-Disposition header
  const disposition = res.headers["content-disposition"];
  let filename = "rawfile.zip";
  if (disposition) {
    const match = disposition.match(/filename="?([^";]+)"?/);
    if (match) filename = match[1];
  }
  const url = window.URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
