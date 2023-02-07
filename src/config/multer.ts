import multer, { Options } from "multer";
import path from "path";

export const multerConfigs: Options = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, next) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const formatedOriginalName = file.originalname
        .replace(/\s+/g, "-")
        .toLowerCase();
      const filename = `${uniqueSuffix}-${formatedOriginalName}`;
      next(null, filename);
    },
  }),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3mb
  },
  fileFilter: (req, file, next) => {
    const allowedMimes = [
      "image/jpg",
      "image/jpeg",
      "image/pjpeg",
      "image/png",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      next(null, true);
    } else {
      next(new Error("Tipo do arquivo inválido"));
    }
  },
};
