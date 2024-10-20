import cd from "cloudinary";
import { env } from "~/env.mjs";

const cloudinary = cd.v2;

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export { cloudinary };
