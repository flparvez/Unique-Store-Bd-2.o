'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaginationControls({
  pagination,
}: {
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = pagination.page;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={() => changePage(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span>
        Page {pagination.page} of {pagination.pages}
      </span>
      <button
        onClick={() => changePage(page + 1)}
        disabled={page >= pagination.pages}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
