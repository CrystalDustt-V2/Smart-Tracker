import { Navigation } from "@/components/Navigation";
import { UserProfile } from "@/components/UserProfile";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        
        <UserProfile />
      </div>
    </div>
  );
}