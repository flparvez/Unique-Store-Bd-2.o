'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { CloudinaryUploadResult } from '@/lib/cloudinary';

interface ImageUploaderProps {
  onUploadComplete: (uploadedImages: CloudinaryUploadResult[]) => void;
  initialImages?: CloudinaryUploadResult[];
  onRemoveImage?: (index: number) => void;
}

interface FileWithPreview extends File {
  preview: string;
}

export function ImageUploader({ 
  onUploadComplete, 
  initialImages = [],
  onRemoveImage 
}: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<CloudinaryUploadResult[]>(initialImages);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const removePreviewImage = (index: number) => {
    if (onRemoveImage) {
      onRemoveImage(index);
    }
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);
      onUploadComplete(data.data);
      setFiles([]);
      setPreviewImages((prev) => [...prev, ...data.data]);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Clean up object URLs
  const cleanUp = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the files here'
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Files to upload</h3>
          <div className="grid grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md">
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                    onLoad={() => cleanUp()}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <p className="text-xs truncate mt-1">{file.name}</p>
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={uploadFiles}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          {isUploading && (
            <Progress value={uploadProgress} className="h-2" />
          )}
        </div>
      )}

      {previewImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Images</h3>
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md">
                  <Image
                    src={image.url}
                    alt={`Uploaded ${index}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePreviewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}