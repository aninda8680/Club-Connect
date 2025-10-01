import multer from "multer";
import path from "path";

// Storage setup → use postuploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "postuploads/"); // ✅ saving inside /postuploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

// File filter → only images allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  cb(new Error("Only images are allowed"));
};

export const upload = multer({ storage, fileFilter });
