"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'Login' | 'Register';

const AuthForm = () => {
    const session = useSession();
    const [variant, setVariant] = useState<Variant>("Login");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push('/users');
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if(variant === "Login"){
            setVariant("Register")
        }else{
            setVariant("Login")
        }
    },[variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues:{
            name: "",
            email: "",
            password: ""
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setLoading(true);

        if(variant === "Register"){
           axios.post('api/register', data)
           .then(() => signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
           }))
           .catch(() => toast.error("Something went wrong"))
           .finally(() => setLoading(false));
        }

        if(variant === "Login"){
           signIn('credentials', {
            ...data,
            redirect: false,
           })
           .then((callback) => {
            if(callback?.error){
              toast.error("Invalid credentials");
            }
            if(callback?.ok && !callback?.error){
              toast.success("Logged in successfully");
              router.push('/users');
            }
          })
          .finally(() => setLoading(false));
        }
    };

    const socialAction = (action: string) => {
        setLoading(true);

        signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          toast.success('Logged in successfully');
        }
      })
      .finally(() => setLoading(false));
    };

    if (!mounted) {
        return null; // Return null during server-side rendering
    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "Register" && (
                        <Input
                            disabled={loading}
                            register={register}
                            errors={errors}
                            required
                            id="name"
                            label="Name"
                        />
                    )}
                    <Input
                        disabled={loading}
                        register={register}
                        errors={errors}
                        required
                        id="email"
                        label="Email address"
                        type="email"
                    />
                    <Input
                        disabled={loading}
                        register={register}
                        errors={errors}
                        required
                        id="password"
                        label="Password"
                        type="password"
                    />
                    <div className="flex justify-center items-center">
                        <div>
                            <Button disabled={loading} type="submit">
                                {variant === "Login" ? "Sign in" : "Register"}
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Social Login Buttons */}

                <div className="mt-6 flex gap-2">
                    <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                    <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                </div>

                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === "Login" ? "New to Messenger?" : "Already have an account?"}
                    </div>
                    <div onClick={toggleVariant} className="underline cursor-pointer">
                        {variant === "Login" ? "Create an account" : "Login"}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm;