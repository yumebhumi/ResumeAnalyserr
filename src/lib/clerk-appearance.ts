export const clerkAppearance = {
  variables: {
    colorPrimary: "#C08457",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#2E2A28",
    colorText: "#2E2A28",
    colorTextSecondary: "#6B635D",
    colorNeutral: "#6B635D",
    colorDanger: "#B45309",
    borderRadius: "14px",
  },
  elements: {
    cardBox: "w-full",
    card: "w-full rounded-[24px] border border-[rgba(24,19,17,0.08)] bg-[#FAF3E0] p-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
    main: "gap-5",
    rootBox: "w-full",
    headerTitle: "text-[#1C1917] text-[32px] font-bold tracking-[-0.02em] sm:text-[40px]",
    headerSubtitle: "text-[#57534E] text-base sm:text-lg",
    socialButtonsBlockButton:
      "rounded-[14px] border border-[rgba(24,19,17,0.10)] bg-white text-[#2E2A28] shadow-none transition-colors duration-200 hover:bg-[#F8F4EF] hover:text-[#2E2A28]",
    socialButtonsBlockButtonText: "text-[#2E2A28] font-medium",
    socialButtonsProviderIcon: "opacity-100",
    socialButtonsBlockButtonArrow: "text-[#6B635D]",
    dividerLine: "bg-[rgba(24,19,17,0.10)]",
    dividerText: "text-[#6B635D]",
    formFieldLabel: "text-[#2E2A28] text-sm font-medium",
    formFieldInput:
      "h-[54px] rounded-[14px] border border-[rgba(0,0,0,0.08)] bg-white px-4 text-[#1C1917] placeholder:text-[#78716C] transition-[border-color,background-color,box-shadow] duration-200 focus:border-[#C08457] focus:ring-4 focus:ring-[rgba(192,132,87,0.18)]",
    formFieldInputShowPasswordButton:
      "text-[#8C837C] transition-colors duration-200 hover:text-[#2E2A28]",
    formFieldAction:
      "text-[#D6AD60] transition-colors duration-200 hover:text-[#FAF3E0]",
    formFieldWarningText: "text-[#8C837C]",
    formFieldSuccessText: "text-[#6B635D]",
    formFieldErrorText: "text-[#8C837C]",
    formFieldHintText: "text-[#6B635D]",
    formButtonPrimary:
      "h-14 rounded-[14px] bg-[#C08457] px-6 text-white font-semibold shadow-[0_8px_20px_rgba(192,132,87,0.25)] transition-[background-color,box-shadow] duration-200 hover:bg-[#D6AD60]",
    footer: "mt-6 border-t border-[rgba(24,19,17,0.08)] bg-transparent px-0 py-4",
    footerAction: "bg-transparent shadow-none py-0",
    footerActionText: "text-[#6B635D]",
    footerActionLink: "text-[#C08457] transition-colors duration-200 hover:text-[#D6AD60]",
    identityPreviewText: "text-[#2E2A28]",
    identityPreviewEditButton:
      "text-[#C08457] transition-colors duration-200 hover:text-[#2E2A28]",
    formResendCodeLink:
      "text-[#C08457] transition-colors duration-200 hover:text-[#2E2A28]",
    otpCodeFieldInput:
      "h-12 rounded-[14px] border border-[rgba(24,19,17,0.12)] bg-white text-[#2E2A28] transition-[border-color,box-shadow] duration-200 focus:border-[#C08457] focus:ring-4 focus:ring-[rgba(192,132,87,0.18)]",
    alternativeMethodsBlockButton:
      "rounded-[14px] border border-[rgba(24,19,17,0.10)] bg-white text-[#2E2A28] transition-colors duration-200 hover:bg-[#F8F4EF]",
    alternativeMethodsBlockButtonText: "text-[#2E2A28] font-medium",
    alert: "rounded-[14px] border border-[rgba(24,19,17,0.10)] bg-[#FCF8F4]",
    alertText: "text-[#6B635D]",
    alertIcon: "text-[#C08457]",
    footerPageLink: "text-[rgba(107,99,93,0.6)]",
    footerPageLink__signIn:
      "text-[#C08457] transition-colors duration-200 hover:text-[#D6AD60]",
    footerPageLink__signUp:
      "text-[#C08457] transition-colors duration-200 hover:text-[#D6AD60]",
    footerPageLink__verifyEmail:
      "text-[#C08457] transition-colors duration-200 hover:text-[#D6AD60]",
    badge: "bg-transparent text-[rgba(107,99,93,0.6)]",
    badgeText: "text-[rgba(107,99,93,0.6)]",
    captcha: "rounded-[14px]",
    navbar: "hidden",
  },
} as const;
