import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Your recruiter-ready career workspace."
      subtitle="Analyze your resume, improve your ATS score, and build a polished portfolio with AI."
    >
      <SignIn
        fallbackRedirectUrl="/dashboard"
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </AuthShell>
  );
}
