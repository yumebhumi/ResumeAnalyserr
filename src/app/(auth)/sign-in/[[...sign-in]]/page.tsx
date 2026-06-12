import { SignIn } from "@clerk/nextjs";

import { AuthCardShell } from "@/components/auth-card-shell";
import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Your recruiter-ready career workspace."
      subtitle="Analyze your resume, improve your ATS score, and build a polished portfolio with AI."
    >
      <AuthCardShell
        title="Sign in to HireMe AI"
        subtitle="Welcome back! Please sign in to continue."
      >
        <SignIn
          fallbackRedirectUrl="/dashboard"
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </AuthCardShell>
    </AuthShell>
  );
}
