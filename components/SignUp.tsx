'use client';

import React from 'react';
import { useState } from 'react';
import { signUpSchema } from '@/schema/signUpSchema';
import { useForm, SubmitHandler } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
  
const SignUp = () => {
    const router = useRouter();
    const [ verifying, setVerifying ] = useState<boolean>(false);
    const { signUp, isLoaded, setActive } = useSignUp();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ authError, setAuthError ] = useState<string | null>(null);
    const [ verificationCode, setVerificationCode ] = useState<string>("");
    const [ verificationError, setVerificationError ] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signUpSchema>>(
        { 
            resolver: zodResolver(signUpSchema),
            defaultValues: {
                email: "",
                password: "",
                passwordConfirmation: "",
            }
        }
    );

    const submitHandler = async (data: z.infer<typeof signUpSchema>) => {
        if(!isLoaded) return; 
        setIsSubmitting(true);
        setAuthError(null);

        try{
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setVerifying(true);
        }catch(err: any){
            setAuthError(err.errors?.[0]?.message || err?.message || "An error occurred during sign up, please try again.");
        }finally{
            setIsSubmitting(false);
        }
    }

    const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!isLoaded || !signUp) return;
        setVerificationError(null);
        setIsSubmitting(true);

        try{
            const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
            console.log(result);
            if(result.status === 'complete'){
                await setActive({ session: result.createdSessionId });
                router.push('/dashboard');
            }else{
                console.log("Verification Incomplete");
                setVerificationError("Verification failed.");
            }
        }catch(err: any){
            console.log("Verification error: ", err);
            setVerificationError(err.errors?.['0']?.message || "An error occurred during sign up, please try again.");
        }finally{
            setIsSubmitting(false);
        }
    }

    if(verifying) return (
        <Card className='w-full max-w-md border border-default-200 bg-default-50 shadow-xl'>
            <CardHeader>
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>We have sent a verification code to your email address</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleVerification}>
                    <div className='flex flex-col gap-5'>
                        <Input 
                            id="verification_code"
                            placeholder="Enter your Verification Code"
                            value={verificationCode}
                            onChange={(e) => { setVerificationCode(e.target.value) }}
                        />
                        <Button className="w-full cursor-pointer">Verify</Button>
                    </div>
                    {isSubmitting && (<div className="mt-4 text-md text-muted-foreground">Verifying. Please wait.....</div>)}
                    {verificationError && (<p className="mt-2 text-sm text-red-500 font-medium">{verificationError}</p>)}
                </form>
            </CardContent>
        </Card>
    );

  return (
    <div className='flex w-full h-full justify-center items-center' id='clerk-captcha'>
        <form onSubmit={handleSubmit(submitHandler)}>
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>
                        <h1 className='text-2xl font-bold'>Sign Up</h1>
                    </CardTitle>
                    <CardDescription>
                    Access your files. Anytime. Anywhere.
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                placeholder="Email"
                                type='text'
                                {...register("email")}
                                className={cn("w-full", errors.email && "border-red-500")}
                            />
                            {errors.email && (<p className="text-sm text-red-500">{errors.email.message}</p>)}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="Password"
                                type='password'
                                {...register("password")}
                                className={cn("w-full", errors.password && "border-red-500")}
                            />
                            {errors.password && (<p className="text-sm text-red-500">{errors.password.message}</p>)}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input 
                                id="confirm-password"
                                placeholder="Confirm Password"
                                type='password'
                                {...register("passwordConfirmation")}
                                className={cn("w-full", errors.passwordConfirmation && "border-red-500")}
                            />
                            {errors.passwordConfirmation && (<p className="text-sm text-red-500">{errors.passwordConfirmation.message}</p>)}
                        </div>
                    </div>
                    {isSubmitting && (<div className="mt-4 text-md text-muted-foreground">Processing. Please wait.....</div>)}
                    {authError && (<p className="mt-2 text-sm text-red-500 font-medium">{authError}</p>)}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        type='button'
                        onClick={() => { router.push('/sign-in') }}
                    >Sign In</Button>
                    <Button
                        className='cursor-pointer'
                        type='submit'
                    >Submit</Button>
                </CardFooter>
            </Card>
        </form>
    </div>
  )
}

export default SignUp