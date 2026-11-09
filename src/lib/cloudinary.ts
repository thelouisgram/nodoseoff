import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function ensureCloudinary() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)");
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

export async function uploadProfileImage(
  userId: string,
  fileBase64: string,
  filename: string
): Promise<{ publicId: string; url: string }> {
  const cld = ensureCloudinary();
  const folder = process.env.CLOUDINARY_PROFILE_FOLDER || "nodoseoff/profiles";
  const result = await cld.uploader.upload(
    `data:application/octet-stream;base64,${fileBase64}`,
    {
      folder,
      public_id: `${userId}/${Date.now()}-${filename.replace(/\s+/g, "_")}`,
      overwrite: true,
      resource_type: "image",
    }
  );
  return { publicId: result.public_id, url: result.secure_url };
}

export async function deleteCloudinaryAsset(publicId: string) {
  if (!publicId) return;
  const cld = ensureCloudinary();
  await cld.uploader.destroy(publicId, { resource_type: "image" });
}
