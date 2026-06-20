import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/analyze(.*)",
  "/github(.*)",
  "/portfolio(.*)",
  "/exports(.*)",
  "/pricing(.*)",
  "/setting(.*)",
  "/settings(.*)",
  "/user-profile(.*)",
]);

const hasClerkConfig = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);

const protectedMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
}, (req) => ({
  signInUrl: new URL("/sign-in", req.url).toString(),
  signUpUrl: new URL("/sign-up", req.url).toString(),
}));

export default function proxy(
  ...args: Parameters<typeof protectedMiddleware>
) {
  if (!hasClerkConfig) {
    return NextResponse.next();
  }

  return protectedMiddleware(...args);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
