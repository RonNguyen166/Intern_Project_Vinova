import multer from "multer";
import { v4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// const storage = multer.memoryStorage();
// export const upload = multer({ storage });

// export const s3Client = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
//   region: process.env.AWS_REGION!,
// });
// export const s3Upload = async (file: any) => {
//   const imageName = `uploads/${v4()}-${file.originalname}`;
//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Body: file.buffer,
//     Key: imageName,
//   };
//   await s3Client.send(new PutObjectCommand(param));
//   return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
// };

// export const s3GetUpload = async (url: string) => {
//   const imageName = url.slice(url?.indexOf("uploads"));
//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: imageName,
//   };
//   return await getSignedUrl(s3Client, new GetObjectCommand(param), {
//     expiresIn: 15 * 60,
//   });
// };

// export const s3DeleteUpload = async (url: string) => {
//   const imageName = url.slice(url?.indexOf("uploads"));
//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: imageName,
//   };
//   return await s3Client.send(new DeleteObjectCommand(param));
// };
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export default class S3Upload {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION!,
    });
  }
  async put(file: any) {
    const imageName = `uploads/${v4()}-${file.originalname}`;
    const param = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Body: file.buffer,
      Key: imageName,
      ContentType: file.mimetype,
    };
    await this.s3Client.send(new PutObjectCommand(param));
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
  }

  async get(url: string) {
    const imageName = url.slice(url?.indexOf("uploads"));
    console.log(imageName);
    const param = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: imageName,
    };

    return await getSignedUrl(this.s3Client, new GetObjectCommand(param), {
      expiresIn: 3600,
    });
  }

  async delete(url: string) {
    const imageName = url.slice(url?.indexOf("uploads"));
    const param = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: imageName,
    };
    return await this.s3Client.send(new DeleteObjectCommand(param));
  }
}
