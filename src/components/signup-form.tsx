"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { toast } from "@/src/components/ui/toast";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

 async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const phone = formData.get("phone")?.toString().trim();

  if (!name || !email || !password || !phone) {
    toast.add({
      title: "Missing information",
      description: "Please fill in all required fields.",
    });

    return;
  }

  setIsSubmitting(true);

  try {
    // 1. Create account
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    });

    const result = await response.json();

    // Registration failed
    if (!response.ok) {
      toast.add({
        title: "Registration failed",
        description:
          result?.error?.message ??
          "Unable to create your account. Please try again.",
      });

      return;
    }

    // 2. Registration successful
    toast.add({
      title: "Account created",
      description: "Signing you in...",
    });

    // 3. Create Auth.js session
    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Login failed
    if (loginResult?.error) {
      toast.add({
        title: "Account created",
        description:
          "Your account was created, but automatic sign in failed. Please sign in manually.",
      });

      router.push("/login");
      return;
    }

    // 4. Auth.js session now exists
    router.push("/dashboard");
    router.refresh();
  } catch (error) {
    console.error("Registration error:", error);

    toast.add({
      title: "Something went wrong",
      description:
        "Unable to create your account. Please try again later.",
    });
  } finally {
    setIsSubmitting(false);
  }
}

  async function handleGoogleSignup() {
    setIsSubmitting(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google signup error:", error);

      toast.add({
        title: "Google sign up failed",
        description:
          "Unable to sign up with Google. Please try again.",
      });

      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <span className="sr-only">
                SkyBlip Academy
              </span>
            </div>

            <h1 className="text-xl font-bold">
              Welcome to SkyBlip Academy
            </h1>

            <FieldDescription>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium underline underline-offset-4"
              >
                Sign in
              </Link>
            </FieldDescription>
          </div>

          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">
              Name
            </FieldLabel>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John"
              autoComplete="name"
              required
            />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">
              Email
            </FieldLabel>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              required
            />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </Field>

          {/* Phone */}
          <Field>
            <FieldLabel htmlFor="phone">
              Phone
            </FieldLabel>

            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+919876543210"
              autoComplete="tel"
              required
            />
          </Field>

          {/* Create Account */}
          <Field>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white hover:bg-gray-600 hover:text-white"
            >
              {isSubmitting
                ? "Creating account..."
                : "Create Account"}
            </Button>
          </Field>

          {/* Separator */}
          <FieldSeparator>
            Or
          </FieldSeparator>

          {/* Google */}
          <Field>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={isSubmitting}
              onClick={handleGoogleSignup}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>

              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>

      {/* Terms */}
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}