"use client"
import useSWR from 'swr';
import { fetcher } from './fetcher';
import { IOrder } from '@/models/Order';
import { FilterParams, ICategory, IProduct } from '@/types/product';
import { IUser } from '@/models/User';



interface OrderResponse {
  success: boolean;
  orders: IOrder[];
}
export interface ProductResponse {
  success: boolean;
  products: IProduct[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface User{
  user: IUser[]
}
export const useFilteredProducts = (params: FilterParams) => {
  const {
    query = '',
    minPrice = 0,
    maxPrice = 1000000,
    sort = 'newest',
    page = 1,
    limit = 12,
    featured = false,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set('minPrice', String(minPrice));
  queryParams.set('maxPrice', String(maxPrice));
  queryParams.set('sort', sort);
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));

  if (query.trim() !== '') {
    queryParams.set('query', query.trim());
  }

  if (featured) {
    queryParams.set('featured', 'true');
  }

  const endpoint = `/api/products/filter?${queryParams.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ProductResponse>(endpoint, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    error,
    isLoading,
    mutate,
  };
};
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
  } = useSWR<ProductResponse>('/api/products', fetcher);
  // const {
  //   data: products,
  //   error,
  //   isLoading,
  //   mutate,
  // } = useSWR<ProductResponse>('/api/products', fetcher, {
  //   refreshInterval: 5000, // 🔄 auto re-fetch every 5s
  //   revalidateOnFocus: true,
  // });


  
  return {
    products,
    error,
    isLoading,
    mutate, // useful for refetching after create/update/delete
  };
};





export const useGetUsers = () => {
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR<User>('/api/auth/register', fetcher);


  
  return {
    users,
    error,
    isLoading,
    mutate, // useful for refetching after create/update/delete
  };
};




export const useSearchProducts = (query: string = '') => {
  const shouldFetch = query.trim().length > 0;
  const endpoint = shouldFetch ? `/api/products/filter?query=${query}` : null;

  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR<ProductResponse>(endpoint, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  return {
    products,
    error,
    isLoading,
    mutate,
  };
};
export const useCategory = () => {
  const {
    data: category,
    error,
    isLoading,
    mutate,
  } = useSWR<ICategory[]>('/api/categories', fetcher);


  
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
    fetcher
    // {
    //   refreshInterval: 5000,
    //   revalidateOnFocus: true,
    // }
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


// export const useProductBySlug = (slug: string | null) => {
//   const shouldFetch = !!slug;

//   const {
//     data,
//     error,
//     isLoading,
//     mutate,
//   } = useSWR<IProduct>(
//     shouldFetch ? `/api/products/${slug}` : null,
//     fetcher,
//     {
//       refreshInterval: 5000,
//       revalidateOnFocus: true,
//     }
//   );

//   return {
//     product: data,
//     error,
//     isLoading,
//     mutate,
//   };
// };



export const useCategoryBySlug = (slug: string | null) => {
  const shouldFetch = !!slug;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<ICategory>(
    shouldFetch ? `/api/categories/${slug}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  return {
    category: data,
    error,
    isLoading,
    mutate,
  };
};
