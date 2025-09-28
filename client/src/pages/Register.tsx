import { RegisterForm } from "@/components/AuthForms";
import { useLocation } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();

  const handleRegisterSuccess = () => {
    console.log('Registration successful, redirecting to dashboard');
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
}