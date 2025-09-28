import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { MapPin, Activity, Cloud, Shirt, Shield } from "lucide-react";
import heroImage from "@assets/generated_images/Smart_Tracker_IoT_device_hero_e64d67ef.png";

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(270deg, rgb(0 0 0 / 0.8) 0%, rgb(0 0 0 / 0.4) 100%), url(${heroImage})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="outline" className="mb-6 backdrop-blur-sm bg-background/10">
          <Shield className="h-3 w-3 mr-1" />
          Advanced IoT Technology
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Your Complete{" "}
          <span className="text-primary">Smart Tracker</span>{" "}
          Solution
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          Combine GPS tracking, weather monitoring, activity reminders, and smart outfit recommendations 
          in one intelligent IoT device designed for modern life.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/dashboard" data-testid="link-hero-dashboard">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg font-semibold min-w-48"
            >
              Try Dashboard
            </Button>
          </Link>
          <Link href="/register" data-testid="link-hero-register">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-lg backdrop-blur-sm bg-background/10 border-white/20 text-white hover:bg-white/20"
            >
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">GPS Tracking</h3>
            <p className="text-sm text-gray-300">Real-time location with SOS</p>
          </div>
          
          <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <Cloud className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Weather Station</h3>
            <p className="text-sm text-gray-300">Live environmental data</p>
          </div>
          
          <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Activity Reminders</h3>
            <p className="text-sm text-gray-300">Smart daily scheduling</p>
          </div>
          
          <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <Shirt className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">WeatherFit</h3>
            <p className="text-sm text-gray-300">Smart outfit suggestions</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}