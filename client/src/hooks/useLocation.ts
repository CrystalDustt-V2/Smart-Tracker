import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";

export function useDeviceLocation(deviceId: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["/api/devices", deviceId, "location"],
    enabled: !!deviceId,
    retry: false,
  });
}

export function useLocationHistory(deviceId: string | undefined, limit = 50) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["/api/devices", deviceId, "location-history", { limit }],
    enabled: !!deviceId,
    retry: false,
  });
}