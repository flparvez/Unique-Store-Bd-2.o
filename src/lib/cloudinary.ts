import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

export async function uploadImage(imageFile: File): Promise<CloudinaryUploadResult> {
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'unique-store-bd',
        resource_type: 'image',
        overwrite: true, // ✅ Overwrite to make the transformed version permanent
        transformation: [
          {
            width: 800,
            crop: 'scale',
            quality: 'auto:eco',
            fetch_format: 'auto',
          },
          {
            overlay: 'ea4imit2icsqfpwahihm', // ✅ Logo public ID
            width: 100,
            opacity: 90,
            gravity: 'north_west', // ✅ Top-left corner
            x: 20,
            y: 20,
          },
          {
            overlay: {
              font_family: 'Poppins',
              font_size: 24,
              font_weight: 'bold',
              text_align: 'center',
              text: 'Unique Store Bd',
            },
            color: '#ffffff',
            gravity: 'center',
          
            x: 30,
            y: 30,
     
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      }
    ).end(buffer);
  });
}


export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}