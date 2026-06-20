import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  const authEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (!authEnabled) {
    return (
      <div className="mx-auto max-w-[980px] pb-8">
        <div className="rounded-[24px] border border-[var(--border)] bg-card p-6 text-sm text-[var(--text-secondary)] shadow-[var(--card-shadow)]">
          Authentication is not configured for this deployment yet. Add Clerk
          environment variables in Vercel to enable account management.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[980px] pb-8">
      <div className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-card p-4 shadow-[var(--card-shadow)]">
        <UserProfile
          routing="path"
          path="/user-profile"
          appearance={{
            variables: {
              colorPrimary: "var(--primary)",
              colorBackground: "var(--surface)",
              colorText: "var(--text-primary)",
              colorInputBackground: "var(--background)",
              colorInputText: "var(--text-primary)",
              borderRadius: "16px",
            },
          }}
        />
      </div>
    </div>
  );
}
