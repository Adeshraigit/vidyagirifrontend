import * as z from "zod";

export const signUpSchema = z
.object({
    email: z
        .string()
        .min(1,{ message: "Email is Required"})
        .email({ message: "Please enter a valid email"}),
    password: z
        .string()
        .min(1, { message: "Password is Required"})
        .min(8, { message: "Password should be minimum of 8 Characters"}),
    passwordConfirmation: z
        .string()
        .min(1, { message: "Please confirm your password" }),
})
.refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});