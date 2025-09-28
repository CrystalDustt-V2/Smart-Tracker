import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/hooks/useAuth";
import { 
  Moon, 
  Sun, 
  Activity, 
  MapPin, 
  Cloud, 
  Shirt, 
  Settings,
  AlertTriangle,
  LogOut
} from "lucide-react";

interface NavigationProps {
  showLoginButton?: boolean;
}

export function Navigation({ showLoginButton = false }: NavigationProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, isLoading } = useAuth();

  const isActive = (path: string) => location === path;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  // Don't show navigation on loading
  if (isLoading) {
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
            {isAuthenticated ? (
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

                <Link href="/profile" data-testid="link-profile">
                  <Button 
                    variant={isActive("/profile") ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </>
            ) : showLoginButton ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogin}
                  data-testid="button-login"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={handleLogin}
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </>
            ) : null}

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
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  data-testid="button-sos"
                  className="text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                
                <Avatar className="h-8 w-8 hover-elevate cursor-pointer" data-testid="avatar-user">
                  <AvatarImage src={user?.profileImageUrl || ""} alt="User" />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
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