import * as z from "zod";

export const signUpSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please enter a valid email." }),

    password: z
        .string()
        .min(1, { message: "Password is required." })
        .min(8, { message: "Password should be a minimum of 8 characters." })
        .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Password must include at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Password must include at least one special character." }),

    passwordConfirmation: z
        .string()
        .min(1, { message: "Please type out the password again." })
})
.refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});
