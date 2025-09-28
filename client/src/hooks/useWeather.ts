import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { WeatherData } from "@shared/schema";

export function useDeviceWeather(deviceId: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["/api/devices", deviceId, "weather"],
    enabled: !!deviceId,
    retry: false,
  });
}