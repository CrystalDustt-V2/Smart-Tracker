import { LoginForm, RegisterForm } from '../AuthForms';

export default function AuthFormsExample() {
  return (
    <div className="p-6 bg-background space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <LoginForm onSuccess={() => console.log('Login successful')} />
        <RegisterForm onSuccess={() => console.log('Registration successful')} />
      </div>
    </div>
  );
}