import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

const router = express.Router();

// Cloudinary Config Check
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Cloudinary config missing in .env file!");
} else {
  console.log(
    "✅ Cloudinary config loaded:",
    process.env.CLOUDINARY_CLOUD_NAME
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file received in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📤 Uploading file to Cloudinary...");

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "wavewanderer" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          // Error detail frontend ko bhejo taaki humein pata chale
          return res
            .status(500)
            .json({
              message: "Cloudinary Upload Failed",
              error: error.message,
            });
        }
        console.log("✅ Upload Successful:", result.secure_url);
        res.json({ url: result.secure_url });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res
      .status(500)
      .json({ message: "Server error during upload", error: error.message });
  }
});

export default router;
