import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
}, (req) => ({
  signInUrl: new URL("/sign-in", req.url).toString(),
  signUpUrl: new URL("/sign-up", req.url).toString(),
}));

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
