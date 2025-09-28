import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { OutfitRecommendation, InsertOutfitRecommendation } from "@shared/schema";

export function useOutfits(limit = 10) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["/api/outfits", { limit }],
    retry: false,
  });
}

export function useCreateOutfit() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (outfit: InsertOutfitRecommendation) => {
      return await apiRequest("POST", "/api/outfits", outfit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outfits"] });
      toast({
        title: "Success",
        description: "Outfit recommendation created",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create outfit recommendation",
        variant: "destructive",
      });
    },
  });
}

export function useRateOutfit() {
  return useMutation({
    mutationFn: async ({ outfitId, liked }: { outfitId: string; liked: boolean }) => {
      return await apiRequest("PUT", `/api/outfits/${outfitId}/rate`, { liked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/outfits"] });
    },
  });
}