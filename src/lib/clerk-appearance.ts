export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorBackground: "var(--auth-card)",
    colorInputBackground: "var(--auth-surface)",
    colorInputText: "var(--auth-text)",
    colorText: "var(--auth-text)",
    colorTextSecondary: "var(--auth-muted)",
    colorNeutral: "var(--auth-muted)",
    colorDanger: "#B45309",
    borderRadius: "14px",
  },
  elements: {
    cardBox: "w-full",
    card: "w-full rounded-none border-0 bg-transparent p-0 shadow-none",
    main: "gap-2",
    rootBox: "w-full",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "!h-[44px] rounded-[14px] border border-[var(--border)] !bg-[var(--auth-surface)] !text-[var(--auth-text)] shadow-none transition-colors duration-200 hover:!bg-[var(--surface-soft)] hover:!text-[var(--auth-text)] focus:!text-[var(--auth-text)]",
    socialButtonsBlockButtonText:
      "!text-[var(--auth-text)] text-sm font-medium group-hover:!text-[var(--auth-text)]",
    socialButtonsProviderIcon: "opacity-100",
    socialButtonsBlockButtonArrow: "hidden",
    socialButtonsBlockButton__google: "w-full",
    socialButtonsBlockButton__github:
      "w-full [&_svg]:!text-[var(--auth-text)] [&_svg]:!fill-current [&_svg_path]:!fill-current",
    socialButtonsBlockButton__identifier: "hidden",
    socialButtonsBlock: "grid grid-cols-2 gap-2",
    dividerLine: "!bg-[var(--border)]",
    dividerText: "!text-[var(--auth-muted)]",
    formFieldLabel: "!text-[var(--auth-text)] text-sm font-medium",
    formFieldInput:
      "!h-[44px] rounded-[14px] border border-[var(--border)] !bg-[var(--auth-surface)] px-4 !text-[var(--auth-text)] placeholder:!text-[var(--auth-muted)] transition-[border-color,background-color,box-shadow] duration-200 focus:!border-[var(--primary)] focus:ring-4 focus:ring-[rgba(192,132,87,0.18)]",
    formFieldInputShowPasswordButton:
      "!text-[var(--auth-muted)] transition-colors duration-200 hover:!text-[var(--auth-text)]",
    formFieldAction:
      "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--secondary)]",
    formFieldWarningText: "!text-[var(--auth-muted)]",
    formFieldSuccessText: "!text-[var(--auth-muted)]",
    formFieldErrorText: "!text-[var(--auth-muted)]",
    formFieldHintText: "!text-[var(--auth-muted)]",
    formButtonPrimary:
      "!h-[44px] rounded-[14px] !bg-[var(--primary)] px-6 !text-[#1C1917] font-semibold shadow-[0_10px_25px_rgba(192,132,87,0.20)] transition-[background-color,box-shadow] duration-200 hover:!bg-[var(--secondary)]",
    footer: "mt-2 border-t border-[var(--border)] bg-transparent px-0 py-2",
    footerAction: "bg-transparent shadow-none py-0",
    footerActionText: "!text-[var(--auth-muted)]",
    footerActionLink: "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--secondary)]",
    identityPreviewText: "!text-[var(--auth-text)]",
    identityPreviewEditButton:
      "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--auth-text)]",
    formResendCodeLink:
      "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--auth-text)]",
    otpCodeFieldInput:
      "h-12 rounded-[14px] border border-[var(--border)] !bg-[var(--auth-surface)] !text-[var(--auth-text)] transition-[border-color,box-shadow] duration-200 focus:!border-[var(--primary)] focus:ring-4 focus:ring-[rgba(192,132,87,0.18)]",
    alternativeMethodsBlockButton:
      "rounded-[14px] border border-[var(--border)] !bg-[var(--auth-surface)] !text-[var(--auth-text)] transition-colors duration-200 hover:!bg-[var(--surface-soft)]",
    alternativeMethodsBlockButtonText: "!text-[var(--auth-text)] font-medium",
    alert: "rounded-[14px] border border-[var(--border)] !bg-[var(--auth-surface)]",
    alertText: "!text-[var(--auth-muted)]",
    alertIcon: "!text-[var(--primary)]",
    footerPageLink: "!text-[var(--auth-muted)]/70",
    footerPageLink__signIn:
      "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--secondary)]",
    footerPageLink__signUp:
      "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--secondary)]",
    footerPageLink__verifyEmail:
      "!text-[var(--primary)] transition-colors duration-200 hover:!text-[var(--secondary)]",
    badge: "hidden",
    badgeText: "hidden",
    captcha: "rounded-[14px]",
    navbar: "hidden",
  },
} as const;
