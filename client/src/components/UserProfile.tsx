import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Edit,
  Plus,
  Trash2
} from "lucide-react";
import { useState } from "react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  location: string;
  notifications: boolean;
  locationSharing: boolean;
  emergencyMode: boolean;
  weatherAlerts: boolean;
  activityReminders: boolean;
}

export function UserProfile() {
  // todo: remove mock functionality
  const [settings, setSettings] = useState<UserSettings>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    notifications: true,
    locationSharing: true,
    emergencyMode: false,
    weatherAlerts: true,
    activityReminders: true
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Jane Doe", phone: "+1 (555) 987-6543", relationship: "Spouse" },
    { id: "2", name: "Bob Smith", phone: "+1 (555) 555-0123", relationship: "Emergency Contact" }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    console.log('Saving profile settings:', settings);
    // todo: remove mock functionality
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      phone: "",
      relationship: ""
    };
    setEmergencyContacts(prev => [...prev, newContact]);
    console.log('Adding emergency contact');
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
    console.log('Removing emergency contact:', id);
  };

  const updateEmergencyContact = (id: string, field: keyof EmergencyContact, value: string) => {
    setEmergencyContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{settings.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Mail className="h-4 w-4" />
                  {settings.email}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default">Smart Tracker User</Badge>
                  <Badge variant="outline">Premium</Badge>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              data-testid="button-edit-profile"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                disabled={!isEditing}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                disabled={!isEditing}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                disabled={!isEditing}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                data-testid="input-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-9"
                  value={settings.location}
                  disabled={!isEditing}
                  onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                  data-testid="input-location"
                />
              </div>
            </div>

            {isEditing && (
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
                data-testid="button-save-profile"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Privacy & Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive alerts and updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, notifications: checked }))
                  }
                  data-testid="switch-notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Location Sharing</Label>
                  <p className="text-xs text-muted-foreground">
                    Share GPS location with emergency contacts
                  </p>
                </div>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, locationSharing: checked }))
                  }
                  data-testid="switch-location-sharing"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Emergency Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable enhanced SOS features
                  </p>
                </div>
                <Switch
                  checked={settings.emergencyMode}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emergencyMode: checked }))
                  }
                  data-testid="switch-emergency-mode"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Weather Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about weather changes
                  </p>
                </div>
                <Switch
                  checked={settings.weatherAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, weatherAlerts: checked }))
                  }
                  data-testid="switch-weather-alerts"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Activity Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive daily activity notifications
                  </p>
                </div>
                <Switch
                  checked={settings.activityReminders}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, activityReminders: checked }))
                  }
                  data-testid="switch-activity-reminders"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                Add trusted contacts for emergency situations
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addEmergencyContact}
              data-testid="button-add-contact"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {contact.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'EC'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                  data-testid={`input-contact-name-${contact.id}`}
                />
                <Input
                  placeholder="Phone number"
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                  data-testid={`input-contact-phone-${contact.id}`}
                />
                <Input
                  placeholder="Relationship"
                  value={contact.relationship}
                  onChange={(e) => updateEmergencyContact(contact.id, 'relationship', e.target.value)}
                  data-testid={`input-contact-relationship-${contact.id}`}
                />
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEmergencyContact(contact.id)}
                data-testid={`button-remove-contact-${contact.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          {emergencyContacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No emergency contacts added yet</p>
              <p className="text-sm">Add trusted contacts for emergency situations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}