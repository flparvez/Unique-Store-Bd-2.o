'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CloudinaryUploadResult } from '@/lib/cloudinary';
import { useCategoryBySlug } from '@/hooks/UseOrders';

export function CategoryForm({ slug }: { slug: string }) {
  const { category, isLoading } = useCategoryBySlug(slug);

  const router = useRouter();

  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<CloudinaryUploadResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fill form values when category is loaded
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setTags(category.tags || '');
      setDescription(category.description || '');
      setImages(category.images || []);
    }
  }, [category]);

  const handleImageUpload = (uploaded: CloudinaryUploadResult[]) => {
    setImages((prev) => [...prev, ...uploaded]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        tags,
        description,
        images: images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
        })),
      };

      const url = category
        ? `/api/categories/${category._id}`
        : '/api/categories';
      const method = category ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save category');

      router.push('/admin/categories');
      router.refresh();
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto px-4">
      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="category-name">Category Name</Label>
        <Input
          id="category-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="category-tags">Category Tags</Label>
        <Input
          id="category-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. electronics, mobiles"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="category-description">Description</Label>
        <Textarea
          id="category-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Write a short description..."
        />
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Category Images</Label>
        <ImageUploader
          onUploadComplete={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          initialImages={images}
        />
      </div>

      {/* Submit Button */}
      <div>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  );
}
