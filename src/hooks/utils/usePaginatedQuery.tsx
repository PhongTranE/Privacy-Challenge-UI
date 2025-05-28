import { useState, useEffect } from 'react';
import { useQuery, QueryKey } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/utils/useDebounce';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages?: number | null;
    currentPage?: number;
    perPage?: number;
    hasNext: boolean;
    hasPrev?: boolean;
  };
}

interface UsePaginatedQueryOptions<TData> {
  queryKey: QueryKey;
  queryFn: (page: number, perPage: number, search: string, count?: boolean) => Promise<TData>;
  search?: string;
  perPage?: number;
}

export function usePaginatedQuery<TData extends PaginatedResponse<any>>({
  queryKey,
  queryFn,
  search = '',
  perPage = 5,
}: UsePaginatedQueryOptions<TData>) {
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const shouldCount = debouncedSearch.trim().length > 0;

  const query = useQuery({
    queryKey: [...queryKey, page, perPage, debouncedSearch],
    queryFn: () => queryFn(page, perPage, debouncedSearch, shouldCount),
    staleTime: 30000,
    gcTime: 60000,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (query.data?.data.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [query.data, page]);

  return {
    ...query,
    page,
    setPage,
    debouncedSearch,
    hasNext: query.data?.meta?.hasNext ?? false,
    totalItems: query.data?.meta?.totalItems ?? null,
  };
}
