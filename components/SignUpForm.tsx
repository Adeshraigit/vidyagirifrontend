"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signUpSchema } from "@/schema/signUpSchema";
import {
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error: any) {
      console.error(error);
      setAuthError(error.errors?.[0]?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setVerificationError("Verification could not be completed.");
      }
    } catch (error: any) {
      console.error(error);
      setVerificationError(error.errors?.[0]?.message || "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",      // adjust as needed
        redirectUrlComplete: "/", // adjust as needed
      });
    } catch (error) {
      console.error("Google sign-up error:", error);
    }
  };

  if (verifying) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl border">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm">
            We've sent a verification code to your email
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationError && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{verificationError}</span>
            </div>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter the 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center">
            Didn’t receive a code?{" "}
            <button
              type="button"
              onClick={async () => {
                await signUp?.prepareEmailAddressVerification({ strategy: "email_code" });
              }}
              className="text-primary hover:underline font-medium"
            >
              Resend
            </button>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border">
      <CardHeader className="text-center space-y-1">
        <h1 className="text-2xl font-semibold">Create Your Account</h1>
        <p className="text-muted-foreground text-sm">
          Sign up to start managing your images securely
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {authError && (
          <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
              className="pl-9"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

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
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("passwordConfirmation")}
              className="pl-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            {errors.passwordConfirmation && (
              <p className="text-xs text-destructive mt-1">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute inset-x-0 -top-2 text-center text-xs bg-background text-muted-foreground px-2">
            or
          </span>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 533.5 544.3">
            <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95.1h146.9c-6.4 34.4-25.6 63.6-54.6 83v68h88.3c51.8-47.8 81.9-118.4 81.9-196.9z"/>
            <path fill="#34a853" d="M272 544.3c73.5 0 135-24.3 180-66.2l-88.3-68c-24.6 16.5-56.1 26-91.7 26-70.6 0-130.5-47.7-151.8-111.7H30.1v70.3C75.9 483.1 167.8 544.3 272 544.3z"/>
            <path fill="#fbbc04" d="M120.2 324.4c-10.1-29.6-10.1-61.2 0-90.8V163.3H30.1c-36.4 72.8-36.4 157.1 0 229.9l90.1-68.8z"/>
            <path fill="#ea4335" d="M272 107.9c39.9-.6 78.3 14.2 107.4 40.7l79.8-79.8C405.7 24.7 344.2.4 272 0 167.8 0 75.9 61.2 30.1 163.3l90.1 70.3c21.3-63.9 81.2-111.7 151.8-111.7z"/>
          </svg>
          Sign up with Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="ml-1 text-primary hover:underline font-medium">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
