import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const fileUploader = async function (filePath) {
  if (!filePath) return null;

  try {
    await fs.access(filePath);

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    await fs.unlink(filePath);

    return {
       url: response.secure_url, 
       public_id: response.public_id 
      };

  } catch (error) {
    console.error("Upload error:", error.message);
    if (await fs.access(filePath).catch(() => false)) await fs.unlink(filePath);
    throw error;
  }
};

     
/*

⚡ Most Useful Fields You’ll Use
secure_url → final HTTPS URL (DB me save karna isi ko best hai ✅).
public_id → unique ID jo Cloudinary deta hai (future me delete/update karne ke liye use hota hai).
resource_type → "image" / "video" / "raw".
format → file type (jpg, png, mp4, etc.).
bytes → file size in bytes.
width & height → image/video dimensions.
duration (agar video hai) → length in seconds.

*/