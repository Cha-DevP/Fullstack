import multer from "multer";
import {v4 as uuid} from 'uuid';
import path from "path";
import { ensureDirSync } from "fs-extra";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __basePath = path.join("..", "upload");

export const rootPath = ()=>{
  return String(path.join(__dirname,__basePath));
}

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|pdf/;
  const extname = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.test(extname)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, JPG, PNG, GIF, and PDF files are allowed."
      ),
      false
    );
  }
};

export const generateStorage = (subDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.join(__dirname, __basePath, subDir);
      ensureDirSync(folderPath);

      cb(null, folderPath);
    },
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
    filename: (req, file, cb) => {
      cb(null,`${uuid()}${path.extname(file.originalname)}`);
    }
  });
};

export const createMulterUpload = (storage) => {
  return multer({ storage: storage });
};

export const buildPath = (baseDir, fileName) => {
  if(!baseDir || !fileName || typeof baseDir !== 'string' || typeof fileName !== 'string')
  {
    return null;
  }
  return path.join(__basePath,baseDir, fileName);
};