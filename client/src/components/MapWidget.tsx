import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Zap, 
  RefreshCw, 
  AlertTriangle,
  Shield,
  Maximize
} from "lucide-react";
import { useState } from "react";

export function MapWidget() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  
  // todo: remove mock functionality
  const locationData = {
    latitude: 40.7128,
    longitude: -74.0060,
    address: "123 Main St, New York, NY 10001",
    lastUpdated: new Date().toLocaleTimeString(),
    batteryLevel: 78,
    signalStrength: "Strong",
    isMoving: false,
    speed: 0
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Location refresh triggered');
    // todo: remove mock functionality
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleSOS = () => {
    setSosActive(!sosActive);
    console.log('SOS triggered:', !sosActive);
  };

  const handleCenter = () => {
    console.log('Center on current location');
  };

  const handleFullscreen = () => {
    console.log('Open fullscreen map');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          GPS Tracker
        </CardTitle>
        <div className="flex items-center gap-1">
          <Badge 
            variant={locationData.signalStrength === "Strong" ? "default" : "secondary"}
            className="text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            {locationData.signalStrength}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh-location"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mock Map Display */}
        <div className="relative h-48 bg-muted rounded-lg border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            {/* Grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-muted-foreground/10" />
                ))}
              </div>
            </div>
            
            {/* Current Location Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="h-4 w-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse" />
                <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-2 right-2 space-y-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onClick={handleCenter}
                data-testid="button-center-map"
              >
                <Navigation className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-background/80"
                onClick={handleFullscreen}
                data-testid="button-fullscreen-map"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="space-y-3">
          <div className="text-center">
            <div className="font-mono text-sm text-muted-foreground">
              {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
            </div>
            <div className="text-sm">
              {locationData.address}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Battery Level</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${locationData.batteryLevel}%` }}
                  />
                </div>
                <span className="font-mono text-xs">{locationData.batteryLevel}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Status</div>
              <Badge variant={locationData.isMoving ? "default" : "secondary"} className="text-xs">
                {locationData.isMoving ? `Moving ${locationData.speed} km/h` : "Stationary"}
              </Badge>
            </div>
          </div>
        </div>

        {/* SOS Button */}
        <div className="pt-2 border-t">
          <Button
            variant={sosActive ? "destructive" : "outline"}
            className="w-full gap-2"
            onClick={handleSOS}
            data-testid="button-sos"
          >
            {sosActive ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                SOS ACTIVE - Tap to Cancel
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Emergency SOS
              </>
            )}
          </Button>
          
          <div className="text-xs text-center text-muted-foreground mt-2">
            Last updated: {locationData.lastUpdated}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}