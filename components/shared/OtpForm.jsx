"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import UIButton from "@/components/shared/UIButton";
import { verifyOtpSchema } from "@/lib/zSchema";

export default function OtpForm({ email, onSubmit, loading, onResend }) {
    const [timer, setTimer] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            email: email || "",
            otp: "",
        },
    });

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleResend = () => {
        if (onResend) {
            onResend();
            setTimer(60);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
                {/* OTP Field */}
                <Field data-invalid={!!errors.otp}>
                    <FieldLabel htmlFor="otp" className="sr-only">
                        One-Time Password
                    </FieldLabel>
                    <div className="flex justify-center pt-2 pb-2">
                        <Controller
                            name="otp"
                            control={control}
                            render={({ field }) => (
                                <InputOTP maxLength={6} {...field} id="otp">
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />
                    </div>
                    <FieldDescription className="text-center">
                        Please enter the 6-digit code.
                    </FieldDescription>
                    {errors.otp && (
                        <FieldError className="text-center">{errors.otp.message}</FieldError>
                    )}
                </Field>

                {/* Submit Button */}
                <UIButton type="submit" loading={loading} className="w-full">
                    Verify
                </UIButton>

                <div className="text-center mt-2 text-sm text-muted-foreground">
                    {timer > 0 ? (
                        <span>Resend OTP in {timer}s</span>
                    ) : (
                        <button type="button" onClick={handleResend} className="font-medium hover:underline text-foreground">
                            Resend OTP
                        </button>
                    )}
                </div>
            </FieldGroup>
        </form>
    );
}