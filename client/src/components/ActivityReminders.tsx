import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Clock, 
  Coffee, 
  Utensils, 
  Moon, 
  Dumbbell,
  CheckCircle,
  Circle,
  Plus
} from "lucide-react";
import { useState } from "react";

interface Activity {
  id: string;
  title: string;
  time: string;
  icon: any;
  completed: boolean;
  enabled: boolean;
  priority: "high" | "medium" | "low";
}

export function ActivityReminders() {
  // todo: remove mock functionality
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Morning Coffee",
      time: "08:00",
      icon: Coffee,
      completed: true,
      enabled: true,
      priority: "medium"
    },
    {
      id: "2",
      title: "Lunch Break",
      time: "12:30",
      icon: Utensils,
      completed: false,
      enabled: true,
      priority: "high"
    },
    {
      id: "3",
      title: "Workout Session",
      time: "18:00",
      icon: Dumbbell,
      completed: false,
      enabled: true,
      priority: "high"
    },
    {
      id: "4",
      title: "Evening Wind Down",
      time: "22:00",
      icon: Moon,
      completed: false,
      enabled: false,
      priority: "low"
    }
  ]);

  const toggleActivity = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
    console.log('Activity toggled:', id);
  };

  const toggleEnabled = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, enabled: !activity.enabled }
          : activity
      )
    );
    console.log('Activity enabled toggled:', id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Activity Reminders
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          data-testid="button-add-activity"
          onClick={() => console.log('Add new activity')}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div 
              key={activity.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                activity.enabled ? 'bg-card' : 'bg-muted/50'
              } hover-elevate`}
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleActivity(activity.id)}
                  data-testid={`button-toggle-${activity.id}`}
                >
                  {activity.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className={`font-medium ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {activity.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                      <Badge 
                        variant={getPriorityColor(activity.priority) as any}
                        className="text-xs px-1.5 py-0"
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Switch
                checked={activity.enabled}
                onCheckedChange={() => toggleEnabled(activity.id)}
                data-testid={`switch-${activity.id}`}
              />
            </div>
          );
        })}

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Completed today:</span>
            <span className="font-mono">
              {activities.filter(a => a.completed).length} / {activities.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}