import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchProperties,
  fetchFeaturedProperties,
  fetchPropertyById,
  getCachedProperties,
  getCachedFeaturedProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  type PropertyFormInput,
} from '@/lib/api/properties';

const KEYS = {
  all: ['properties'] as const,
  featured: ['properties', 'featured'] as const,
  detail: (id: string) => ['properties', id] as const,
};

export function useProperties() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: fetchProperties,
    initialData: getCachedProperties,
    staleTime: 10_000,
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: KEYS.featured,
    queryFn: fetchFeaturedProperties,
    initialData: getCachedFeaturedProperties,
    staleTime: 10_000,
  });
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: KEYS.detail(id ?? ''),
    queryFn: () => fetchPropertyById(id as string),
    enabled: Boolean(id),
    staleTime: 10_000,
  });
}

function useInvalidateProperties() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] });
  };
}

export function useCreateProperty() {
  const invalidate = useInvalidateProperties();
  return useMutation({
    mutationFn: (input: PropertyFormInput) => createProperty(input),
    onSuccess: invalidate,
  });
}

export function useUpdateProperty() {
  const invalidate = useInvalidateProperties();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PropertyFormInput }) => updateProperty(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteProperty() {
  const invalidate = useInvalidateProperties();
  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: invalidate,
  });
}
