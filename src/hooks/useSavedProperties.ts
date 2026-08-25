import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSavedProperties, fetchSavedPropertyIds, saveProperty, unsaveProperty } from '@/lib/api/savedProperties';
import { useAuth } from '@/context/AuthContext';

const KEY = ['saved-properties'] as const;
const IDS_KEY = ['saved-property-ids'] as const;

/** Full property details for the signed-in user's saved list (account dashboard). */
export function useSavedProperties() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...KEY, user?.id],
    queryFn: () => fetchSavedProperties(user!.id),
    enabled: Boolean(user),
  });
}

/** Lightweight set of saved property IDs, for "is this one saved?" toggles across the site. */
export function useSavedPropertyIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...IDS_KEY, user?.id],
    queryFn: () => fetchSavedPropertyIds(user!.id),
    enabled: Boolean(user),
    staleTime: 30_000,
  });
}

export function useToggleSavedProperty() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, isSaved }: { propertyId: string; isSaved: boolean }) => {
      if (!user) throw new Error('Sign in to save properties.');
      if (isSaved) {
        await unsaveProperty(user.id, propertyId);
      } else {
        await saveProperty(user.id, propertyId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: IDS_KEY });
    },
  });
}
