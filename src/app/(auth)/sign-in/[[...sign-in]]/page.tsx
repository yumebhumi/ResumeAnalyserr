import { SignIn } from "@clerk/nextjs";

import { AuthCardShell } from "@/components/auth-card-shell";
import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  const authEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <AuthShell
      title="Your recruiter-ready career workspace."
      subtitle="Analyze your resume, improve your ATS score, and build a polished portfolio with AI."
    >
      <AuthCardShell
        title="Sign in to HireMe AI"
        subtitle="Welcome back! Please sign in to continue."
      >
        {authEnabled ? (
          <SignIn
            fallbackRedirectUrl="/dashboard"
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
          />
        ) : (
          <div className="rounded-[20px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-5 text-center text-sm text-[#D6D3D1]">
            Authentication is not configured for this deployment yet. Add Clerk
            environment variables in Vercel to enable sign in.
          </div>
        )}
      </AuthCardShell>
    </AuthShell>
  );
}
