import { Navigation } from "@/components/Navigation";
import { MapWidget } from "@/components/MapWidget";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ActivityReminders } from "@/components/ActivityReminders";
import { WeatherFitWidget } from "@/components/WeatherFitWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  MapPin, 
  Cloud, 
  Shirt, 
  Battery, 
  Wifi,
  AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  // todo: remove mock functionality
  const deviceStatus = {
    isOnline: true,
    batteryLevel: 78,
    lastSeen: new Date().toLocaleTimeString(),
    activeAlerts: 2
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor your Smart Tracker device in real-time
              </p>
            </div>
            
            {/* Device Status */}
            <Card className="w-64">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Device Status</span>
                  <Badge 
                    variant={deviceStatus.isOnline ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {deviceStatus.isOnline ? "Online" : "Offline"}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Battery className="h-3 w-3" />
                    <span>{deviceStatus.batteryLevel}% Battery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-3 w-3" />
                    <span>Last seen: {deviceStatus.lastSeen}</span>
                  </div>
                  {deviceStatus.activeAlerts > 0 && (
                    <div className="flex items-center gap-2 text-orange-500">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{deviceStatus.activeAlerts} active alerts</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Widget */}
            <MapWidget />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2" data-testid="button-locate">
                    <MapPin className="h-5 w-5" />
                    <span className="text-xs">Find Device</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" data-testid="button-weather-sync">
                    <Cloud className="h-5 w-5" />
                    <span className="text-xs">Sync Weather</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" data-testid="button-activity-check">
                    <Activity className="h-5 w-5" />
                    <span className="text-xs">Check Activities</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2" data-testid="button-outfit-refresh">
                    <Shirt className="h-5 w-5" />
                    <span className="text-xs">New Outfits</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeatherWidget />
            <ActivityReminders />
            <WeatherFitWidget />
          </div>
        </div>
      </div>
    </div>
  );
}