'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploadp';
import { IProductImage } from '@/models/Product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import Image from 'next/image';
import { ICategory } from '@/models/Category';
import RichTextEditor from '@/components/RichTextEditor'; // Import the rich text editor
import toast from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }).max(100),
  shortName: z.string().max(50),
  seo: z.string().max(150),
  description: z.string().min(50, {
    message: 'Description must be at least 50 characters.',
  }).max(20000), // Increased max length for HTML content
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(1, 'Price must be at least 1'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  warranty: z.string().default('7 day warranty'),
  isFeatured: z.boolean().default(false),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Spec key is required'),
      value: z.string().min(1, 'Spec value is required'),
    })
  ).optional(),
});

export function ProductUploadForm({ categories }: { categories: ICategory[] }) {

  const site = process.env.SITE_URL || 'https://landig-store.vercel.app/';
  const router = useRouter();
  const [images, setImages] = useState<IProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [currentSpec, setCurrentSpec] = useState({ key: '', value: '' });
  const [previewOpen, setPreviewOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      seo: '',
      shortName: '',
      description: '',
      category: '',
      price: 0,
      originalPrice: undefined,
      stock: 0,
      warranty: '7 day warranty',
      isFeatured: false,
      specifications: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (images.length === 0) {
      toast.error("Please upload at least 1 image");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${site}api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          images,
          specifications: specs.length > 0 ? specs : undefined,
        }),
      });
console.log(response)
      if (!response.ok) {
        throw new Error('Failed to create product');
      }

 
      toast.success("Product created successfully");
      router.push('/admin/products');
    } catch (error) {
      console.log(error);
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (uploadedImages: IProductImage[]) => {
    setImages(prev => [...prev, ...uploadedImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (currentSpec.key && currentSpec.value) {
      setSpecs(prev => [...prev, currentSpec]);
      setCurrentSpec({ key: '', value: '' });
    }
  };

  const removeSpecification = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Basic Info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="Short name for display" {...field} />
                      </FormControl>
                      <FormDescription>
                        Shorter version of product name (max 50 chars)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map(category => (
                            <SelectItem key={category._id} value={category._id}>
                              {category?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Original price before discount"
                          {...field}
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty if no discount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Available quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty</FormLabel>
                      <FormControl>
                        <Input placeholder="Warranty period" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input placeholder="SEO tags (comma separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>
                          Show this product in featured section
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description - Updated to use RichTextEditor */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Detailed product description..."
     
                    />
                  </FormControl>
                  <FormDescription>
                    Write a detailed description with features, benefits, and specifications
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div>
              <FormLabel>Product Images</FormLabel>
              <ImageUploader
                onUploadComplete={handleImageUpload}
                initialImages={images}
                onRemoveImage={handleRemoveImage}
              />
              <FormDescription>
                Upload high-quality images of your product (max 10 images)
              </FormDescription>
            </div>

            {/* Specifications */}
            <div>
              <FormLabel>Specifications</FormLabel>
              <div className="space-y-2">
                {specs?.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-medium">{spec.key}:</span>
                    <span>{spec.value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Specification key"
                    value={currentSpec.key}
                    onChange={e => setCurrentSpec({ ...currentSpec, key: e.target.value })}
                  />
                  <Input
                    placeholder="Specification value"
                    value={currentSpec.value}
                    onChange={e => setCurrentSpec({ ...currentSpec, value: e.target.value })}
                  />
                  <Button
                    type="button"
                    onClick={addSpecification}
                    disabled={!currentSpec.key || !currentSpec.value}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewOpen(true)}
                disabled={!form.formState.isDirty && images.length === 0}
              >
                Preview
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </Form>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Product Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{form.watch('name')}</h2>
              
              {images?.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images?.map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md border">
                      <Image
                        width={100}
                        height={100}
                        src={img.url}
                        alt={img.altText || `Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Details</h3>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.watch('description') }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Price</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">৳{form.watch('price')?.toLocaleString()}</span>
                      {form.watch('originalPrice') && (
                        <span className="text-muted-foreground line-through">
                          ৳{form.watch('originalPrice')?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Stock</h3>
                    <p>{form.watch('stock')} available</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Warranty</h3>
                    <p>{form.watch('warranty')}</p>
                  </div>
                </div>
              </div>

              {specs?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specs?.map((spec, index) => (
                      <div key={index} className="border p-3 rounded-md">
                        <h4 className="font-medium">{spec.key}</h4>
                        <p className="text-muted-foreground">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}