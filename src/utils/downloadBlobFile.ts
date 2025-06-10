export const downloadBlobFile = (
  blob: Blob,
  contentDisposition?: string
): void => {
  let filename = "";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename\*?=([^;\n]*)/i);
    if (match) {
      let raw = match[1].trim();
      if (raw.startsWith("UTF-8''")) {
        raw = decodeURIComponent(raw.replace("UTF-8''", ''));
      }
      raw = raw.replace(/^"|"$/g, '');
      if (raw) filename = raw;
    }
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const triggerFileDownload = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};