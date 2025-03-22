"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

export default function AdminCategoryForm() {
  const [loading, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("image", response.url);
    console.log(response)
    toast.success("Image uploaded successfully!",);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      await apiClient.createCategory(data);
      toast.success("Category created successfully!", );

      // Reset form after successful submission
      setValue("name", "");
      setValue("description", "");
      setValue("image", "");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category",
       
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
  >
    <h2 className="text-2xl font-semibold text-gray-700 text-center">
      Create a New Category
    </h2>

    {/* Category Name */}
    <div className="form-control">
      <label className="label font-medium text-gray-600">Category Name</label>
      <input
        type="text"
        className={`input input-bordered w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
        placeholder="Enter category name"
        {...register("name", { required: "Category name is required" })}
      />
      {errors.name && (
        <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
      )}
    </div>

    {/* Description */}
    <div className="form-control">
      <label className="label font-medium text-gray-600">Description</label>
      <textarea
        className={`textarea textarea-bordered w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:outline-none h-28 ${errors.description ? "border-red-500" : "border-gray-300"}`}
        placeholder="Enter category description"
        {...register("description")}
      />
    </div>

    {/* Category Image Upload */}
    <div className="form-control">
      <label className="label font-medium text-gray-600">Category Image</label>
      <FileUpload onSuccess={handleUploadSuccess} />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300 flex justify-center items-center"
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Category...
        </>
      ) : (
        "Create Category"
      )}
    </button>
  </form>
  );
}
