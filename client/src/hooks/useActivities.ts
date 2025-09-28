import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { Activity, InsertActivity } from "@shared/schema";

export function useActivities() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["/api/activities"],
    retry: false,
  });
}

export function useCreateActivity() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (activity: InsertActivity) => {
      return await apiRequest("POST", "/api/activities", activity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Success",
        description: "Activity created successfully",
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
        description: "Failed to create activity",
        variant: "destructive",
      });
    },
  });
}

export function useToggleActivity() {
  return useMutation({
    mutationFn: async ({ activityId, isCompleted }: { activityId: string; isCompleted: boolean }) => {
      return await apiRequest("PUT", `/api/activities/${activityId}/toggle`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });
}