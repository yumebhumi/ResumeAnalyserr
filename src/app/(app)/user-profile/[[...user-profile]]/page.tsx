import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="mx-auto max-w-[980px] pb-8">
      <div className="overflow-hidden rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <UserProfile
          routing="path"
          path="/user-profile"
          appearance={{
            variables: {
              colorPrimary: "#C08457",
              colorBackground: "#292524",
              colorText: "#FFFFFF",
              colorInputBackground: "#1C1917",
              colorInputText: "#FFFFFF",
              borderRadius: "16px",
            },
          }}
        />
      </div>
    </div>
  );
}
