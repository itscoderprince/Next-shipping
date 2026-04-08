"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UIButton from "@/components/shared/UIButton";
import GoogleButton from "@/components/shared/GoogleButton";
import { loginSchema } from "@/lib/zSchema";
import { REGISTER, FORGOT_PASSWORD } from "@/routes/Website.route";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { toast } from "sonner";
import OtpForm from "@/components/shared/OtpForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [otpEmail, setOtpEmail] = useState("");

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [otpLoading, setOtpLoading] = useState(false);

  // Login
  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post(`/api/auth/login`, values);
      if (data.success) {
        toast.success(data.message || "Login successful!");
        setOtpEmail(values.email);
        reset();
      } else {
        toast.error(data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("error: ", error);
      const errorMsg = error.response?.data?.message || "An error occurred during login.";
      toast.error(errorMsg);
    }
  };

  // Otp verification
  const OtpSubmit = async (values) => {
    setOtpLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/verify-otp`, values);

      if (data.success) {
        toast.success(data.message || "Verification successful!");
        if (data.data?.user) {
          dispatch(setUser(data.data.user));
        }
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.message || "Invalid OTP!");
      }
    } catch (error) {
      console.error("error: ", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred during verification.";
      toast.error(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post(`/api/auth/resend-otp`, { email: otpEmail });
      if (data.success) {
        toast.success(data.message || "OTP resent successfully");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMsg);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{otpEmail ? "Verify your email" : "Welcome back"}</CardTitle>
        <CardDescription>
          {otpEmail ? (
            <>
              We have sent a 6-digit OTP to{" "}
              <span className="font-medium text-foreground">{otpEmail}</span>
            </>
          ) : (
            "Enter your credentials to access your account"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {
          !otpEmail ?
            <>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FieldGroup>
                  {/* Email Field */}
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">
                      <Mail className="w-4 h-4" />
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>

                  {/* Password Field */}
                  <Field data-invalid={!!errors.password}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">
                        <Lock className="w-4 h-4" />
                        Password
                      </FieldLabel>
                      <Link
                        href={FORGOT_PASSWORD}
                        className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pr-10"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                  </Field>

                  {/* Submit Button */}
                  <UIButton type="submit" loading={isSubmitting} className="w-full">
                    Login
                  </UIButton>

                  <FieldSeparator>Or continue with</FieldSeparator>

                  {/* Google Button */}
                  <GoogleButton className="w-full" />

                  {/* Sign up link */}
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link href={REGISTER} className="font-medium">
                      Sign up
                    </Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
            </>
            :
            <>
              <OtpForm
                email={otpEmail}
                onSubmit={OtpSubmit}
                loading={otpLoading}
                onResend={handleResendOtp}
              />
            </>
        }
      </CardContent>
    </Card>
  );
}
