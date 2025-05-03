import { deleteProduct } from "@/lib/action/product-action";
import toast from "react-hot-toast";


export function handleDelete(productId: string) {
  const confirm = window.confirm('Are you sure you want to delete this product?');
  if (!confirm) return;

  toast.promise(
    deleteProduct(productId),
    {
      loading: 'Deleting...',
      success: () => {
        // Refresh the product list or re-fetch data
        return 'Product deleted successfully!';
      },
      error: (err) => err.message || 'Failed to delete',
    }
  );
}