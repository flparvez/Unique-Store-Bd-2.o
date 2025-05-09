import useSWR from 'swr';
import { fetcher } from './fetcher';
import { IOrder } from '@/models/Order';
import { ICategory, IProduct } from '@/types/product';

interface OrderResponse {
  success: boolean;
  orders: IOrder[];
}
interface ProductResponse {
  success: boolean;
  products: IProduct[];
}


export const useOrders = () => {
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useSWR<OrderResponse>('/api/order', fetcher, {
    refreshInterval: 5000, // 🔄 auto re-fetch every 5s
    revalidateOnFocus: true,
  });


  
  return {
    orders,
    error,
    isLoading,
    mutate, // useful for refetching after create/update/delete
  };
};

export const useProducts = () => {
  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR<ProductResponse>('/api/products', fetcher, {
    refreshInterval: 5000, // 🔄 auto re-fetch every 5s
    revalidateOnFocus: true,
  });


  
  return {
    products,
    error,
    isLoading,
    mutate, // useful for refetching after create/update/delete
  };
};

export const useCategory = () => {
  const {
    data: category,
    error,
    isLoading,
    mutate,
  } = useSWR<ICategory[]>('/api/categories', fetcher, {
    refreshInterval: 5000, // 🔄 auto re-fetch every 5s
    revalidateOnFocus: true,
  });


  
  return {
    category,
    error,
    isLoading,
    mutate, // useful for refetching after create/update/delete
  };
};



export const useOrderById = (id: string | null) => {
  const shouldFetch = !!id;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<IOrder>(
    shouldFetch ? `/api/order/${id}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  return {
    order: data,
    error,
    isLoading,
    mutate,
  };
};

export const useProductByid = (id: string | null) => {
  const shouldFetch = !!id;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<IProduct>(
    shouldFetch ? `/api/products/id/${id}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  return {
    product: data,
    error,
    isLoading,
    mutate,
  };
};
