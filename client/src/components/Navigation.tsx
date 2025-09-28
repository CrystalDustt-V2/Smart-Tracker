import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme-context";
import { 
  Moon, 
  Sun, 
  Activity, 
  MapPin, 
  Cloud, 
  Shirt, 
  Settings,
  AlertTriangle 
} from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // todo: remove mock functionality

  const isActive = (path: string) => location === path;

  if (!isLoggedIn && location !== "/" && location !== "/login" && location !== "/register") {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Smart Tracker</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" data-testid="link-dashboard">
                  <Button 
                    variant={isActive("/dashboard") ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link href="/weather" data-testid="link-weather">
                  <Button 
                    variant={isActive("/weather") ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Cloud className="h-4 w-4" />
                    Weather
                  </Button>
                </Link>

                <Link href="/activities" data-testid="link-activities">
                  <Button 
                    variant={isActive("/activities") ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Activities
                    <Badge variant="destructive" className="ml-1">2</Badge>
                  </Button>
                </Link>

                <Link href="/outfit" data-testid="link-outfit">
                  <Button 
                    variant={isActive("/outfit") ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Shirt className="h-4 w-4" />
                    WeatherFit
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" data-testid="link-register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* User Profile */}
            {isLoggedIn && (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  data-testid="button-sos"
                  className="text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
                
                <Link href="/profile" data-testid="link-profile">
                  <Avatar className="h-8 w-8 hover-elevate cursor-pointer">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}