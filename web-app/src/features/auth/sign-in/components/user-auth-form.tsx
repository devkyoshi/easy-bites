
import { HTMLAttributes, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { IconBrandFacebook, IconBrandGithub } from "@tabler/icons-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { PasswordInput } from "@/components/password-input.tsx"


import { LoginRequest } from "@/services/auth-service.ts"
import {useAuth} from "@/stores/auth-context.tsx";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Please enter your username" })
        .min(3, { message: "Username must be at least 3 characters long" }),
    password: z
        .string()
        .min(1, { message: "Please enter your password" })
        .min(7, { message: "Password must be at least 7 characters long" }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { signIn } = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const creds: LoginRequest = {
                username: data.username,
                password: data.password,
            }
            await signIn(creds)

            toast.success("Logged in successfully!")
            await navigate({to: "/"})
        } catch (err: any) {
            toast.error(err.message || "Login failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("grid gap-3", className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="your_username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                            <Link
                                to="/forgot-password"
                                className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75"
                            >
                                Forgot password?
                            </Link>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="mt-2" disabled={isLoading}>
                    {isLoading ? "Logging in…" : "Login"}
                </Button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" type="button" disabled={isLoading}>
                        <IconBrandGithub className="h-4 w-4" /> GitHub
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading}>
                        <IconBrandFacebook className="h-4 w-4" /> Facebook
                    </Button>
                </div>
            </form>
        </Form>
    )
}
