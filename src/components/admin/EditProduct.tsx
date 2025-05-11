'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageUploader } from '@/components/ImageUploadp';
import { IProductImage } from '@/models/Product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import Image from 'next/image';

import RichTextEditor from '@/components/RichTextEditor';
import { Badge } from '@/components/ui/badge';

import { useCategory } from '@/hooks/UseOrders';
import { IProduct } from '@/types/product';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(200),
  shortName: z.string().max(150),
  seo: z.string().max(150),
  description: z.string().min(50, { message: 'Description must be at least 50 characters.' }).max(20000),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(1, 'Price must be at least 1'),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  lastUpdatedIndex: z.coerce.number().min(0, 'Last Index Number').optional(),
  popularityScore: z.coerce.number().min(0, 'Last Index Number').optional(),
  advanced: z.coerce.number().min(0, 'advanced').optional(),
  warranty: z.string().default('7 day warranty'),
  video: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Spec key is required'),
      value: z.string().min(1, 'Spec value is required'),
    })
  ).optional(),
});


export function ProductEditForm({product}: {product: IProduct}) {

  const {category}= useCategory()

  const router = useRouter();

  const [images, setImages] = useState<IProductImage[]>(product.images || []);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentSpec, setCurrentSpec] = useState({ key: '', value: '' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      shortName: '',
      seo: '',
      description: '',
      category: product.category._id || '',
      price: 0,
      originalPrice: undefined,
      stock: 0,
      video: '',
      warranty: '7 day warranty',
      isFeatured: false,
      isActive: true,
      specifications: [],
      lastUpdatedIndex: 1,
      popularityScore: 1,
      advanced: 100
    },
  });
  
  // ✅ product এ ডেটা আসলে সব স্টেট ও ফর্ম রিসেট কর
  useEffect(() => {
    if (product) {
      // reset form
      form.reset({
        name: product.name || '',
        shortName: product.shortName || '',
        seo: product.seo || '',
        description: product.description || '',
        category: product.category._id || '',
        price: product.price || 0,
        originalPrice: product.originalPrice,
        stock: product.stock || 0,
        video: product.video || '',
        warranty: product.warranty || '7 day warranty',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive ?? true,
        specifications: product.specifications || [],
        lastUpdatedIndex: product.lastUpdatedIndex || 1,
        popularityScore: product.popularityScore || 1,
        advanced: product.advanced || 100,
      });
  
      // reset local states
      setImages(product.images || []);
      setSpecs(product.specifications || []);
    }
  }, [product, form]);



  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (images.length === 0) {
      toast.error('Please upload at least 1 image');
      return;
    }

    setIsLoading(true);

    try {
      const method = product ? 'PATCH' : 'POST';
      const url = product ? `/api/products/id/${product._id}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          images,
          specifications: specs.length > 0 ? specs : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${product ? 'update' : 'create'} product`);
      }

  
      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
      router.push(`/admin/products`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${product ? 'update' : 'create'} product`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteProduct = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${product._id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully');
      router.push('/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {product ? `Edit ${product.name}` : 'Add New Product'}
          </h1>
          {product && (
            <div className="flex items-center gap-2">
              <Badge variant={product.isActive ? 'default' : 'destructive'}>
                {product.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </Button>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Short Name */}
                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Short name for display" {...field} />
                      </FormControl>
                      <FormDescription>Optional shorter name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {category?.map(category => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* SEO */}
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
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>video</FormLabel>
                      <FormControl>
                        <Input placeholder="video" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



              </div>

              {/* Right */}
              <div className="space-y-4">
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (৳) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Original Price */}
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Before discount"
                          {...field}
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>Optional if discounted</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Available stock" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

       {/* lastUpdatedIndex */}
                <FormField
                  control={form.control}
                  name="lastUpdatedIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>lastUpdatedIndex </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="lastUpdatedIndex" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    {/* popularityScore */}
                <FormField
                  control={form.control}
                  name="popularityScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>popularityScore </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="popularityScore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

     {/* advanced */}
                <FormField
                  control={form.control}
                  name="advanced"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>advanced </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="advanced" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                {/* Warranty */}
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


                {/* Status */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 border p-4 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>Show on homepage</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 border p-4 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Active</FormLabel>
                          <FormDescription>Product is visible</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Enter full description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Images */}
            <div>
              <FormLabel>Product Images *</FormLabel>
              <ImageUploader
                onUploadComplete={handleImageUpload}
                initialImages={images}
                onRemoveImage={handleRemoveImage}
              />
              <FormDescription>First image will be the cover photo</FormDescription>
            </div>

            {/* Specifications */}
            <div>
              <FormLabel>Specifications</FormLabel>
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">{spec.key}: {spec.value}</div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(index)}>
                      ×
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Spec Key" value={currentSpec.key} onChange={e => setCurrentSpec({ ...currentSpec, key: e.target.value })} />
                  <Input placeholder="Spec Value" value={currentSpec.value} onChange={e => setCurrentSpec({ ...currentSpec, value: e.target.value })} />
                  <Button type="button" onClick={addSpecification}>Add</Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => setPreviewOpen(true)}>Preview</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </Form>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Product Preview</DialogTitle>
            </DialogHeader>
            {/* Preview Content */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{form.getValues().name}</h2>
              <p>{form.getValues().description}</p>
              <div className="flex flex-wrap gap-2">
                {images?.map((img, idx) => (
                  <Image key={idx} src={img.url} alt="Product Image" width={100} height={100} />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
