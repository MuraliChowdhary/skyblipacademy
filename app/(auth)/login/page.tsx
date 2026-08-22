import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm flex ">
       

        <LoginForm />
      </div>
    </div>
  );
}