import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
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
