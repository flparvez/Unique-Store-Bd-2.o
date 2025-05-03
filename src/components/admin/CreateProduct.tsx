'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUploader } from '@/components/ImageUploadp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import RichTextEditor from '@/components/RichTextEditor';
import Image from 'next/image';

import type { ICategory } from '@/models/Category';
import type { IProductImage } from '@/models/Product';

const productSchema = z.object({
  name: z.string().min(2).max(200),
  shortName: z.string().max(130),
  seo: z.string().max(150),
  description: z.string().min(50).max(20000),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(1),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0),
  warranty: z.string(),
  isFeatured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductCreateForm({ categories }: { categories: ICategory[] }) {
  const router = useRouter();
  const [images, setImages] = useState<IProductImage[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [currentSpec, setCurrentSpec] = useState({ key: '', value: '' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      shortName: '',
      seo: '',
      description: '',
      category: '',
      price: undefined,
      originalPrice: undefined,
      stock: 1,
      warranty: '7 day warranty',
      isFeatured: false,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);
      const compactImages = images.map(({ url, altText }) => ({ url, altText }));
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...data,
           images: compactImages,
            specifications: specs }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success('Product created successfully!');
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecAdd = () => {
    if (currentSpec.key && currentSpec.value) {
      setSpecs(prev => [...prev, currentSpec]);
      setCurrentSpec({ key: '', value: '' });
    }
  };

  const handleImageUpload = (uploaded: IProductImage[]) => {
    setImages(prev => [...prev, ...uploaded]);
  };

  return (
    <div className="w-full  p-2">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name & Short Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Category & SEO */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Tags</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price & Stock */}
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (৳)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Warranty & Featured */}
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-6">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Featured Product</FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor content={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div>
            <FormLabel>Images</FormLabel>
            <ImageUploader
              onUploadComplete={handleImageUpload}
              initialImages={images}
              onRemoveImage={i => setImages(images.filter((_, idx) => idx !== i))}
            />
          </div>

          {/* Specifications */}
          <div>
            <FormLabel>Specifications</FormLabel>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="font-semibold">{s.key}:</span>
                  <span>{s.value}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}>Remove</Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input placeholder="Key" value={currentSpec.key} onChange={e => setCurrentSpec({ ...currentSpec, key: e.target.value })} />
                <Input placeholder="Value" value={currentSpec.value} onChange={e => setCurrentSpec({ ...currentSpec, value: e.target.value })} />
                <Button type="button" onClick={handleSpecAdd} disabled={!currentSpec.key || !currentSpec.value}>Add</Button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.watch('name')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {images.map((img, i) => (
                <Image key={i} src={img.url} alt={img.altText ?? ''} width={120} height={120} className="object-cover rounded" />
              ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: form.watch('description') }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
