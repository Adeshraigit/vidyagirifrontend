"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signInSchema } from "@/schema/signInSchema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback", // change if needed
        redirectUrlComplete: "/",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border">
      <CardHeader>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to access your secure cloud storage
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {authError && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="identifier"
                type="email"
                placeholder="your.email@example.com"
                {...register("identifier")}
                className="pl-9"
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-destructive mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="pl-9 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute inset-x-0 -top-2 text-center bg-background text-xs text-muted-foreground px-2">
            or
          </span>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          <svg
            className="h-4 w-4 mr-2"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95.1h146.9c-6.4 34.4-25.6 63.6-54.6 83v68h88.3c51.8-47.8 81.9-118.4 81.9-196.9z"
              fill="#4285f4"
            />
            <path
              d="M272 544.3c73.5 0 135-24.3 180-66.2l-88.3-68c-24.6 16.5-56.1 26-91.7 26-70.6 0-130.5-47.7-151.8-111.7H30.1v70.3C75.9 483.1 167.8 544.3 272 544.3z"
              fill="#34a853"
            />
            <path
              d="M120.2 324.4c-10.1-29.6-10.1-61.2 0-90.8V163.3H30.1c-36.4 72.8-36.4 157.1 0 229.9l90.1-68.8z"
              fill="#fbbc04"
            />
            <path
              d="M272 107.9c39.9-.6 78.3 14.2 107.4 40.7l79.8-79.8C405.7 24.7 344.2.4 272 0 167.8 0 75.9 61.2 30.1 163.3l90.1 70.3c21.3-63.9 81.2-111.7 151.8-111.7z"
              fill="#ea4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </CardContent>

      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link href="/sign-up" className="ml-1 text-primary hover:underline font-medium">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
