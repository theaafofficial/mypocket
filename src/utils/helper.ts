import jsPDF from "jspdf";

export interface CloudinaryData {
  access_mode: "public" | "authenticated" | "private";
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  pages: number;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}
export type MediaType =
  | "Image"
  | "Document"
  | "Video"
  | "Image & Video"
  | "Raw";
function isDocument(filename: string): boolean {
  const documentExtensions = [
    ".docx",
    ".doc",
    ".pdf",
    ".pptx",
    ".ppt",
    ".xls",
    ".xlsx",
  ];

  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return documentExtensions.includes(extension);
}

const uploadToCloudinary = async (file: File): Promise<CloudinaryData> => {
  const API_ENDPOINT = `https://api.cloudinary.com/v1_1/${
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
  }/upload`;
  console.log(API_ENDPOINT);
  const fileData = new FormData();
  fileData.append("file", file);
  fileData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  );

  const res = await fetch(API_ENDPOINT, {
    method: "post",
    body: fileData,
  });
  const data = (await res.json()) as CloudinaryData;
  return data;
};

const extractExtension = (filename: string): string => {
  return filename
    .slice(filename.lastIndexOf("."))
    .toLowerCase()
    .replace(".", "");
};

const truncate = (str: string, n: number): string => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

function getFileTypes(mediaType: MediaType): string {
  switch (mediaType) {
    case "Image":
      return "image/*";
    case "Document":
      return ".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .odt, .rtf";
    case "Video":
      return "video/*";
    case "Image & Video":
      return "image/*, video/*";
    case "Raw":
      return "";
    default:
      return "";
  }
}

async function createPDF(urls: string[]): Promise<void> {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let firstPageAdded = false;
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(url);
      const imgRes = await fetch(url as string);
      const imgData = await imgRes.blob();
      const reader = new FileReader();
      reader.readAsDataURL(imgData);
      await new Promise((resolve) => {
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const img = new Image();
          img.onload = () => {
            const { width, height } = pdf.getImageProperties(img);
            const aspectRatio = width / height;
            let scaledWidth = pageWidth - 20;
            let scaledHeight = scaledWidth / aspectRatio;
            if (scaledHeight > pageHeight - 20) {
              scaledHeight = pageHeight - 20;
              scaledWidth = scaledHeight * aspectRatio;
            }
            if (!firstPageAdded) {
              pdf.addImage(img, "JPEG", 10, 10, scaledWidth, scaledHeight);
              firstPageAdded = true;
            } else {
              pdf.addPage();
              pdf.addImage(img, "JPEG", 10, 10, scaledWidth, scaledHeight);
            }
            resolve(null);
          };
          img.src = dataUrl;
        };
      });
    }

    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error(error);
  }
}

async function getBlobFromUrl(url: string): Promise<Blob> {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
}

export {
  isDocument,
  uploadToCloudinary,
  extractExtension,
  truncate,
  getFileTypes,
  createPDF,
  getBlobFromUrl,
};

