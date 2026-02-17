import dotenv from "dotenv";
dotenv.config(); // Ensure env variables load first

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always deliver media over HTTPS
});

export default cloudinary;
