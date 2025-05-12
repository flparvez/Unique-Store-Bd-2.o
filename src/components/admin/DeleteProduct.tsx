import { deleteOrder, deleteProduct } from "@/lib/action /product-action";
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

export function handleDeleteCategory(slug: string) {
  const confirm = window.confirm('Are you sure you want to delete this product?');
  if (!confirm) return;

  toast.promise(
    deleteProduct(slug),
    {
      loading: 'Deleting...',
      success: () => {
        // Refresh the product list or re-fetch data
        return 'Category deleted successfully!';
      },
      error: (err) => err.message || 'Failed to delete',
    }
  );
}



export function handleDeleteOrder(id: string) {
  const confirm = window.confirm('Are you sure you want to delete this product?');
  if (!confirm) return;

  toast.promise(
    deleteOrder(id),
    {
      loading: 'Deleting...',
      success: () => {
        // Refresh the product list or re-fetch data
        return 'Order deleted successfully!';
      },
      error: (err) => err.message || 'Failed to delete',
    }
  );
}

