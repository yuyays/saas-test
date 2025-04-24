"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";
import { Card } from "@/components/ui/card";

export function Login({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === "signin" ? signIn : signUp,
    { error: "" }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center bg-muted py-8 px-2">
      <div className="mx-auto w-full max-w-md">
        <Card className="p-6 sm:p-8 shadow-xl rounded-2xl">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {mode === "signin"
                ? "Sign in to your account"
                : "Create your account"}
            </h2>
          </div>
          <form className="space-y-5 mt-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ""} />
            <input type="hidden" name="priceId" value={priceId || ""} />
            <input type="hidden" name="inviteId" value={inviteId || ""} />
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={50}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
                minLength={8}
                maxLength={100}
                placeholder="Enter your password"
              />
            </div>
            {state?.error && (
              <div className="text-destructive text-sm text-center">
                {state.error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          <div className="mt-8">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-muted-foreground/20" />
              <span className="mx-3 text-xs text-muted-foreground bg-background px-2">
                {mode === "signin"
                  ? "New to our platform?"
                  : "Already have an account?"}
              </span>
              <div className="flex-grow border-t border-muted-foreground/20" />
            </div>
            <Button asChild variant="outline" className="w-full mt-6">
              <Link
                href={`${mode === "signin" ? "/sign-up" : "/sign-in"}${
                  redirect ? `?redirect=${redirect}` : ""
                }${priceId ? `&priceId=${priceId}` : ""}`}
              >
                {mode === "signin"
                  ? "Create an account"
                  : "Sign in to existing account"}
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
