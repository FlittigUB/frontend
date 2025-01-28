"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract the redirect URL from the query string, default to "/portal"
  const redirectUrl = searchParams.get("redirect") || "/portal"

  // Local state for email, password, and submission state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple email validation
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Handle the form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic form checks
    if (!email || !password) {
      toast.error("Vennligst fyll ut alle felt.")
      setIsSubmitting(false)
      return
    }

    if (!isValidEmail(email)) {
      toast.error("Oppgi en gyldig e-post.")
      setIsSubmitting(false)
      return
    }

    try {
      // POST request to your auth endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      )

      // Store JWT token in localStorage (or use a more secure solution in production)
      localStorage.setItem("token", response.data.access_token)

      toast.success("Login vellykket! Omdirigerer...")
      router.push(redirectUrl)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          typeof err.response.data?.message === "string"
            ? err.response.data.message
            : "Login feilet. Sjekk at epost og passord stemmer."
        toast.error(errorMessage)
      } else {
        toast.error("Kunne ikke koble til server.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left side: Form */}
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Title / description */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Velkommen tilbake</h1>
                <p className="text-balance text-muted-foreground">
                  Logg inn til din Flittig konto
                </p>
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Passord</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Glemt passord?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <Button
                variant="default"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                Har du ikke en bruker?{" "}
                <Link href="/portal/registrer-deg" className="underline underline-offset-4">
                  Registrer deg
                </Link>
              </div>
            </div>
          </form>

          {/* Right side: Image */}
          <div className="relative hidden bg-muted md:block">
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}5c6a2d28-09a2-4f9b-87c4-36c0ec26319c.png`}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms & Privacy Notice */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}
