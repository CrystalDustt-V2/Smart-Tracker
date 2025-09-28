import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Shirt, 
  Thermometer, 
  RefreshCw, 
  Heart,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Cloud,
  Sun,
  CloudRain
} from "lucide-react";
import { useState } from "react";

interface OutfitRecommendation {
  id: string;
  name: string;
  items: string[];
  temperature: number;
  weather: string;
  confidence: number;
  liked: boolean | null;
}

export function WeatherFitWidget() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // todo: remove mock functionality
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([
    {
      id: "1",
      name: "Casual Comfort",
      items: ["Light sweater", "Jeans", "Sneakers", "Light jacket"],
      temperature: 18,
      weather: "Partly Cloudy",
      confidence: 85,
      liked: null
    },
    {
      id: "2",
      name: "Professional",
      items: ["Button-up shirt", "Trousers", "Blazer", "Dress shoes"],
      temperature: 20,
      weather: "Sunny",
      confidence: 78,
      liked: true
    },
    {
      id: "3",
      name: "Active Day",
      items: ["T-shirt", "Sports shorts", "Running shoes", "Cap"],
      temperature: 24,
      weather: "Sunny",
      confidence: 92,
      liked: null
    }
  ]);

  const currentWeather = {
    temperature: 19,
    condition: "Partly Cloudy",
    icon: Cloud,
    forecast: "Light clouds, comfortable temperature"
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('WeatherFit recommendations refresh triggered');
    // todo: remove mock functionality
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleLike = (id: string, liked: boolean) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, liked } : rec
      )
    );
    console.log('Outfit rating:', id, liked ? 'liked' : 'disliked');
  };

  const getWeatherIcon = (weather: string) => {
    if (weather.includes("Sunny")) return Sun;
    if (weather.includes("Rain")) return CloudRain;
    return Cloud;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-500";
    if (confidence >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shirt className="h-5 w-5 text-primary" />
          WeatherFit
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh-outfits"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Weather Context */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            {(() => {
              const IconComponent = currentWeather.icon;
              return <IconComponent className="h-5 w-5 text-primary" />;
            })()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold">{currentWeather.temperature}°C</span>
              <Badge variant="outline" className="text-xs">
                {currentWeather.condition}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentWeather.forecast}
            </p>
          </div>
        </div>

        {/* Outfit Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recommendations</h3>
            <Badge variant="secondary" className="text-xs">
              Based on {currentWeather.temperature}°C
            </Badge>
          </div>

          {recommendations.slice(0, 2).map((recommendation) => {
            const WeatherIcon = getWeatherIcon(recommendation.weather);
            return (
              <div 
                key={recommendation.id}
                className="p-3 border rounded-lg hover-elevate space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        <Shirt className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{recommendation.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <WeatherIcon className="h-3 w-3" />
                        <span>{recommendation.weather}</span>
                        <TrendingUp className={`h-3 w-3 ${getConfidenceColor(recommendation.confidence)}`} />
                        <span>{recommendation.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleLike(recommendation.id, true)}
                      data-testid={`button-like-${recommendation.id}`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${
                        recommendation.liked === true ? 'text-green-500' : ''
                      }`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleLike(recommendation.id, false)}
                      data-testid={`button-dislike-${recommendation.id}`}
                    >
                      <ThumbsDown className={`h-3 w-3 ${
                        recommendation.liked === false ? 'text-red-500' : ''
                      }`} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {recommendation.items.map((item, index) => (
                    <div 
                      key={index}
                      className="px-2 py-1 bg-muted/30 rounded text-center"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" className="w-full gap-2" data-testid="button-more-outfits">
          <Heart className="h-4 w-4" />
          View More Recommendations
        </Button>

        <div className="text-xs text-muted-foreground text-center border-t pt-2">
          Personalized based on your preferences and weather patterns
        </div>
      </CardContent>
    </Card>
  );
}