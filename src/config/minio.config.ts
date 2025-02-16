export const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT!,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  bucket: process.env.MINIO_AUDIOS_BUCKET!,
  port: Number(process.env.MINIO_PORT!),
};
