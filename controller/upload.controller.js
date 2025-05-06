import { MulterError } from "multer";
import { buildPath, createMulterUpload, generateStorage } from "../helper/multerhelper.js";

const UPLOAD_URL = "/images";

export const uploadeFile = async (req, res) => {
    try {

        const Storage = generateStorage(UPLOAD_URL);
        const upload = createMulterUpload(Storage).fields([
           {name: "file", maxCount: 1}
        ]);
  
        upload(req, res, async(error) =>{
          if(error instanceof MulterError)
          {
              console.log('Empty field => '+ error?.message);

              return res.status(error.statusCode || 500).json({
                  resultCode: error.statusCode || 500,
                  message:
                  error.message ||
                    "Upload error. Please, double check spelling field name or limitation"
                }); 
          }
          else if (error) 
          {
              console.log('Unknow multer ==>'+error?.message);
              
              return res.status(206).json({
                resultCode: 206,
                message: error.message || "Upload failed."
              });
          }
  
          return res.status(200).json({
            resultCode: 200,
            message: "Operation successfully!",
            fileName: buildPath(UPLOAD_URL, req?.files['file'][0]?.filename),
            mimeType: req?.files['file'][0]?.mimetype,
            fileSize: req?.files['file'][0]?.size || 0,
            encodedSize: req?.files['file'][0].encoding
          });
  
        });
    } 
    catch (error) 
    {
        console.log(error?.message ?? "Internal Service Error");
        return res.status(500).send("Internal Server Error");
    }
}