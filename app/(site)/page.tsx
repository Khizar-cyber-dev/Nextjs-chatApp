'use client';
import Image from "next/image"
import AuthForm from "./components/AuthForm"
import { useEffect } from "react";

export default function Home(){
    useEffect(() => {
        // This is for client side rendering
    }, []);

    return (
        <div className="flex h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image alt="logo" height="48" width="48" className="mx-auto w-auto" src="/images/logo.png"/>
                <h2 className="mt-6 text-center font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            {/* AuthForm */}
            <AuthForm />
        </div>
    )
}
