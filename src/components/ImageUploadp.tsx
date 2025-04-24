'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { IProductImage } from '@/models/Product';
import toast from 'react-hot-toast';


interface ImageUploaderProps {
  onUploadComplete: (uploadedImages: IProductImage[]) => void;
  initialImages?: IProductImage[];
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<IProductImage[]>(initialImages);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...newFiles]);
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
    URL.revokeObjectURL(newFiles[index].preview);
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
      files.forEach(file => formData.append('files', file));

      // Simulate progress (replace with actual upload progress if your API supports it)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
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
      setPreviewImages(prev => [...prev, ...data.data]);

   toast.success("Image uploaded succesfully")
    } catch (error) {
        console.log(error)
  toast.error("image not upload")
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? 'Drop the files here'
              : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Files to upload</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border">
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border">
                  <Image
                    src={image.url}
                    alt={image.altText || `Product image ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePreviewImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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