import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  CloudRain,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useState } from "react";

export function WeatherWidget() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // todo: remove mock functionality
  const weatherData = {
    temperature: 24,
    humidity: 68,
    pressure: 1013.2,
    windSpeed: 12,
    visibility: 10,
    rainLevel: 0,
    location: "New York, NY",
    lastUpdated: new Date().toLocaleTimeString(),
    condition: "Partly Cloudy",
    tempTrend: "up",
    humidityTrend: "down"
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Weather data refresh triggered');
    // todo: remove mock functionality
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          Weather Station
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh-weather"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold font-mono">
            {weatherData.temperature}°C
          </div>
          <div className="text-sm text-muted-foreground">
            {weatherData.condition}
          </div>
          <Badge variant="outline" className="mt-1 text-xs">
            {weatherData.location}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-muted-foreground">Temperature</span>
              {weatherData.tempTrend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
            </div>
            <div className="font-mono text-lg font-semibold">
              {weatherData.temperature}°C
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Humidity</span>
              {weatherData.humidityTrend === "down" ? (
                <TrendingDown className="h-3 w-3 text-blue-500" />
              ) : (
                <TrendingUp className="h-3 w-3 text-blue-500" />
              )}
            </div>
            <div className="space-y-1">
              <div className="font-mono text-lg font-semibold">
                {weatherData.humidity}%
              </div>
              <Progress value={weatherData.humidity} className="h-1" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4 text-purple-500" />
              <span className="text-muted-foreground">Pressure</span>
            </div>
            <div className="font-mono text-sm font-semibold">
              {weatherData.pressure} hPa
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="text-muted-foreground">Wind</span>
            </div>
            <div className="font-mono text-sm font-semibold">
              {weatherData.windSpeed} km/h
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Visibility</span>
            </div>
            <div className="font-mono text-sm font-semibold">
              {weatherData.visibility} km
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <CloudRain className="h-4 w-4 text-blue-600" />
              <span className="text-muted-foreground">Rain</span>
            </div>
            <div className="font-mono text-sm font-semibold">
              {weatherData.rainLevel} mm
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center border-t pt-2">
          Last updated: {weatherData.lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
}