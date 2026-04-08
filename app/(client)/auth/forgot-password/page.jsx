"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UIButton from "@/components/shared/UIButton";
import OtpForm from "@/components/shared/OtpForm";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/zSchema";
import { LOGIN } from "@/routes/Website.route";
import { useRouter } from "next/navigation";

import { z } from "zod";

const passwordOnlySchema = z.object({
    newPassword: z.string().min(6, "Minimum 6 characters").regex(/[A-Z]/, "At least one uppercase letter").regex(/[0-9]/, "At least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();

  const [phase, setPhase] = useState("EMAIL"); // EMAIL, OTP, NEW_PASSWORD
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Email form
  const emailForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordOnlySchema),
  });

  // 1) Send forgot password email
  const onEmailSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/auth/forgot-password`, values);
      if (data.success) {
        toast.success(data.message || "OTP sent to email");
        setEmail(values.email);
        setPhase("OTP");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send reset email.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 2) Handle OTP submission (only advancing to next stage)
  const onOtpSubmit = (values) => {
    // We don't hit an api just yet, we just record the OTP
    setOtp(values.otp);
    setPhase("NEW_PASSWORD");
  };

  // 2b) Handle OTP resend
  const handleResendOtp = async () => {
    try {
      const { data } = await axios.post(`/api/auth/resend-otp`, { email });
      if (data.success) {
        toast.success(data.message || "OTP resent successfully");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMsg);
    }
  };

  // 3) Submit the final reset password request
  const onPasswordSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email,
        otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
      
      const { data } = await axios.post(`/api/auth/reset-password`, payload);
      if (data.success) {
        toast.success(data.message || "Password successfully reset!");
        router.push(LOGIN);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMsg);
      // If error is related to OTP being invalid, bounce them back to OTP phase
      if (error.response?.status === 404 || errorMsg.toLowerCase().includes("otp")) {
          setPhase("OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center mt-6">
        <Link 
          href={LOGIN} 
          className="inline-flex items-center text-sm hover:underline text-muted-foreground mr-auto ml-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </Link>
      </div>

      {phase === "EMAIL" && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} noValidate>
              <FieldGroup>
                <Field data-invalid={!!emailForm.formState.errors.email}>
                  <FieldLabel htmlFor="email">
                    <Mail className="w-4 h-4" />
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...emailForm.register("email")}
                  />
                  {emailForm.formState.errors.email && (
                    <FieldError>{emailForm.formState.errors.email.message}</FieldError>
                  )}
                </Field>
                <UIButton type="submit" loading={loading} className="w-full">
                  Send Reset Link
                </UIButton>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}

      {phase === "OTP" && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We have sent a 6-digit OTP to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OtpForm 
              email={email}
              onSubmit={onOtpSubmit}
              loading={false}
              onResend={handleResendOtp}
            />
          </CardContent>
        </Card>
      )}

      {phase === "NEW_PASSWORD" && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate>
              <FieldGroup>
                {/* New Password Field */}
                <Field data-invalid={!!passwordForm.formState.errors.newPassword}>
                  <FieldLabel htmlFor="newPassword">
                    <Lock className="w-4 h-4" />
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pr-10"
                      {...passwordForm.register("newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <FieldError>{passwordForm.formState.errors.newPassword.message}</FieldError>
                  )}
                </Field>

                {/* Confirm Password Field */}
                <Field data-invalid={!!passwordForm.formState.errors.confirmPassword}>
                  <FieldLabel htmlFor="confirmPassword">
                    <Lock className="w-4 h-4" />
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pr-10"
                      {...passwordForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <FieldError>{passwordForm.formState.errors.confirmPassword.message}</FieldError>
                  )}
                </Field>

                <UIButton type="submit" loading={loading} className="w-full">
                  Reset Password
                </UIButton>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}