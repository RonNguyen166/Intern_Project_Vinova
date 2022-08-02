import multer from "multer";
import { v4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const s3Upload = async (file: any) => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION!,
  });
  const imageName = `uploads/${v4()}-${file.originalname}`;
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Body: file.buffer,
    Key: imageName,
  };
  await s3Client.send(new PutObjectCommand(param));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
};

export const s3DeleteUpload = async (url: string) => {
  const imageName = url.slice(url?.indexOf("uploads"));
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_REGION!,
  });
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: imageName,
  };
  return await s3Client.send(new DeleteObjectCommand(param));
};
