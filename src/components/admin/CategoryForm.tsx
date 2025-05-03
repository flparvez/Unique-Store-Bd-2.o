'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CloudinaryUploadResult } from '@/lib/cloudinary';
import { ICategory } from '@/models/Category';

interface CategoryFormProps {
  initialData?: ICategory;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState<string>(initialData?.name || '');
  const [tags, setTags] = useState<string>(initialData?.tags || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [images, setImages] = useState<CloudinaryUploadResult[]>(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageUpload = (uploadedImages: CloudinaryUploadResult[]) => {
    setImages((prev) => [...prev, ...uploadedImages]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const categoryData = {
        name,
        description,
        images: images.map(img => ({ url: img.url, publicId: img.publicId }))
      };

      const url = initialData
        ? `/api/categories/${initialData._id}`
        : '/api/categories';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          required
        />
      </div>
     <div className="space-y-2">
        <Label htmlFor="name">Category Tags</Label>
        <Input
          id="name"
          value={tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <ImageUploader
          onUploadComplete={handleImageUpload}
          initialImages={images}
          onRemoveImage={handleRemoveImage}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Category'}
      </Button>
    </form>
  );
}