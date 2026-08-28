import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSiteContent, updateSiteContent, resetSiteContent } from '@/lib/api/siteContent';
import type { SiteContent } from '@/types/siteContent';

const CONTENT_QUERY_KEY = ['site-content'] as const;

export function useSiteContent() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleSync = () => {
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    };

    window.addEventListener('le-content-change', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('le-content-change', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchSiteContent,
    staleTime: 10_000,
  });
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: SiteContent) => updateSiteContent(content),
    onSuccess: (data) => {
      queryClient.setQueryData(CONTENT_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}

export function useResetSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetSiteContent(),
    onSuccess: (data) => {
      queryClient.setQueryData(CONTENT_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
    },
  });
}
