'use client'

import { Card } from "@/components/ui/card";
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const EmailVerification = ({ params }) => {
    const { token } = use(params);
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            try {
                const { data } = await axios.post('/api/auth/verify-email', { token });
                if (data.success) {
                    setStatus("success");
                    setMessage(data.message || "Your email has been successfully verified.");
                } else {
                    setStatus("error");
                    setMessage(data.message || "Verification failed");
                }
            } catch (error) {
                setStatus("error");
                setMessage(error.response?.data?.message || "This verification link is invalid or has expired.");
            }
        };
        verify();
    }, [token]);

    const verifiedImg = '/images/verified.gif';
    const verificationFailedImg = '/images/verification-failed.gif';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] px-4 py-12">
            <Card className="max-w-md w-full border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white">
                <div className="p-8 sm:p-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-7">

                        {/* Status Visual */}
                        <div className="flex justify-center w-full mt-2">
                            {status === "verifying" ? (
                                <div className="rounded-full bg-blue-50 p-4 ring-1 ring-blue-500/10">
                                    <Loader2 className="h-9 w-9 text-blue-600 animate-spin" strokeWidth={1.5} />
                                </div>
                            ) : status === "success" ? (
                                <div className="relative w-40 h-40 drop-shadow-xl animate-in zoom-in-50 duration-500">
                                    <Image
                                        src={verifiedImg}
                                        alt="Success"
                                        fill
                                        className="object-contain"
                                        sizes="160px"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="relative w-40 h-40 drop-shadow-lg animate-in zoom-in-50 duration-500">
                                    <Image
                                        src={verificationFailedImg}
                                        alt="Failed"
                                        fill
                                        className="object-contain"
                                        sizes="160px"
                                        priority
                                    />
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="space-y-3">
                            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                                {status === "verifying" && "Verifying your email"}
                                {status === "success" && "Verification successful"}
                                {status === "error" && "Verification failed"}
                            </h2>
                            <p className="text-[15px] leading-relaxed text-zinc-500 font-medium max-w-[280px] mx-auto">
                                {status === "verifying"
                                    ? "Please wait a moment while we securely verify your identity."
                                    : message}
                            </p>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-5 w-full">
                            {status === "success" && (
                                <Link
                                    href="/auth/login"
                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3.5 text-[15px] font-medium text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-800 hover:shadow-[0_4px_15px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                                >
                                    Proceed to Login
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            )}
                            {status === "error" && (
                                <div className="space-y-4 w-full">
                                    <Link
                                        href="/auth/register"
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3.5 text-[15px] font-medium text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-800 hover:shadow-[0_4px_15px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                                    >
                                        Try Registering Again
                                    </Link>
                                    <div className="text-[14px] text-center pt-2">
                                        <Link href="/" className="font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
                                            Return to Homepage
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {status === "verifying" && (
                                <div className="w-full h-[52px] rounded-xl bg-zinc-100/60 animate-pulse"></div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EmailVerification;