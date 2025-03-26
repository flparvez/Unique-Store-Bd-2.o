import { CloudinaryUploadResult, uploadImage } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export interface UploadResponse {
  data?: CloudinaryUploadResult[];
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json( 
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.name} exceeds 5MB limit`);
      }
      return uploadImage(file);
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}