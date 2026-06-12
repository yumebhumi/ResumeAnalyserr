import { SignUp } from "@clerk/nextjs";

import { AuthCardShell } from "@/components/auth-card-shell";
import { AuthShell } from "@/components/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Your recruiter-ready career workspace."
      subtitle="Analyze your resume, improve your ATS score, and build a polished portfolio with AI."
    >
      <AuthCardShell
        title="Create your HireMe AI account"
        subtitle="Start building your recruiter-ready career workspace."
      >
        <SignUp
          fallbackRedirectUrl="/dashboard"
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
        />
      </AuthCardShell>
    </AuthShell>
  );
}
