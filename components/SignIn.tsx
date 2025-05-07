'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema } from '@/schema/signInSchema';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';

const SignIn = () => {
	const { register, handleSubmit, formState:{ errors } } = useForm<z.infer<typeof signInSchema>>(
	{
		resolver: zodResolver(signInSchema),
			defaultValues: {
			identifier: "",
			password: "",
		},
	}
	);
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
	const [ authError, setAuthError ] = useState<string | null>(null);
	const { isLoaded, setActive, signIn } = useSignIn();
	const router = useRouter();

	const submitHandler = async (data: z.infer<typeof signInSchema>) => {
		if(!isLoaded) return;
		setIsSubmitting(true);
		setAuthError(null);

		try{
			const result = await signIn.create({
				identifier: data.identifier,
				password: data.password,
			});

			if(result.status === 'complete'){
				await setActive({ session: result.createdSessionId });
				router.push('/dashboard');
			}else setAuthError("Could not complete Sign-In. Please try again.");

		}catch(err: any){
			const errorMessage = err?.errors?.[0]?.message || err?.message || "Something went wrong. Please try again.";
  			setAuthError(errorMessage);
		}finally{
			setIsSubmitting(false);
		}
	}

	return (
		<div className='flex w-full h-full justify-center items-center' id='clerk-captcha'>
			<form onSubmit={handleSubmit(submitHandler)}>
				<Card className="w-[500px]">
					<CardHeader>
						<CardTitle>
							<h1 className='text-2xl font-bold'>Sign In</h1>
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
									{...register("identifier")}
									className={cn("w-full", errors.identifier && "border-red-500")}
								/>
								{errors.identifier && (<p className="text-sm text-red-500">{errors.identifier?.message}</p>)}
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
						</div>
						{isSubmitting && (<div className="mt-4 text-md text-muted-foreground">Processing. Please wait.....</div>)}
						{authError && (<p className="mt-2 text-sm text-red-500 font-medium">{authError}</p>)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button
							className="cursor-pointer"
							variant="outline"
							type='button'
							onClick={() => { router.push('/sign-up') }}
						>Create Account</Button>
						<Button
							className='cursor-pointer'
							type='submit'
						>Login</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	)
}

export default SignIn;