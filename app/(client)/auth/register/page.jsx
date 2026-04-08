"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

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
import { registerSchema } from "@/lib/zSchema";
import { LOGIN } from "@/routes/Website.route";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (values) => {
        try {
            const { data } = await axios.post(`/api/auth/register`, values);
            if (data.success) {
                toast.success(data.message || "Registration successful!");
            } else {
                toast.error(data.message || "Something went wrong!");
            }
        } catch (error) {
            console.error("error: ", error);
            const errorMsg = error.response?.data?.message || "An error occurred during registration.";
            toast.error(errorMsg);
        }
    };

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Fill in the details below to get started
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FieldGroup className="gap-5 lg:gap-7">
                        {/* Full Name Field */}
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="name">
                                <User className="w-4 h-4" />
                                Full Name
                            </FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register("name")}
                            />
                            {errors.name && (
                                <FieldError>{errors.name.message}</FieldError>
                            )}
                        </Field>

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

                        {/* Password + Confirm Password — 1 row on sm+, stacked on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field data-invalid={!!errors.password}>
                                <FieldLabel htmlFor="password">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min 6 chars"
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

                            <Field data-invalid={!!errors.confirmPassword}>
                                <FieldLabel htmlFor="confirmPassword">
                                    <Lock className="w-4 h-4" />
                                    Confirm Password
                                </FieldLabel>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        className="pr-10"
                                        {...register("confirmPassword")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <FieldError>{errors.confirmPassword.message}</FieldError>
                                )}
                            </Field>
                        </div>

                        {/* Submit Button */}
                        <UIButton type="submit" loading={isSubmitting} className="w-full">
                            Create Account
                        </UIButton>

                        <FieldSeparator>Or continue with</FieldSeparator>

                        {/* Google Button */}
                        <GoogleButton className="w-full" />

                        {/* Sign in link */}
                        <FieldDescription className="text-center">
                            Already have an account?{" "}
                            <Link href={LOGIN} className="font-medium">
                                Sign in
                            </Link>
                        </FieldDescription>

                        {/* Terms */}
                        <FieldDescription className="text-center text-xs">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a> and{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
                        </FieldDescription>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}