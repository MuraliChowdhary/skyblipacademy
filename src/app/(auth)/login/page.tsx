import { LoginForm } from "@/src/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm flex ">
        <LoginForm />
      </div>
    </div>
  );
}