import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Your recruiter-ready career workspace."
      subtitle="Analyze your resume, improve your ATS score, and build a polished portfolio with AI."
    >
      <SignUp
        fallbackRedirectUrl="/dashboard"
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </AuthShell>
  );
}
