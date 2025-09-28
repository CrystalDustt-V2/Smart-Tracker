import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { Device, InsertDevice } from "@shared/schema";

export function useDevices() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["/api/devices"],
    retry: false,
  });
}

export function useCreateDevice() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (device: InsertDevice) => {
      return await apiRequest("POST", "/api/devices", device);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Device created successfully",
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
        description: "Failed to create device",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateDeviceStatus() {
  return useMutation({
    mutationFn: async ({ deviceId, isOnline, batteryLevel }: { 
      deviceId: string; 
      isOnline: boolean; 
      batteryLevel?: number;
    }) => {
      return await apiRequest("PUT", `/api/devices/${deviceId}/status`, { isOnline, batteryLevel });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
    },
  });
}