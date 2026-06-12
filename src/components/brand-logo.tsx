"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const logoSrc =
    mounted && resolvedTheme === "light" ? "/hireme-light.jpeg" : "/hire-dark.jpeg";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl",
          iconClassName,
        )}
      >
        <Image
          src={logoSrc}
          alt="HireMe AI logo"
          width={40}
          height={40}
          className="h-full w-full rounded-[inherit] object-cover"
        />
      </span>
      {showText ? (
        <span
          className={cn(
            "text-base font-semibold text-[var(--text-primary)]",
            textClassName,
          )}
        >
          HireMe AI
        </span>
      ) : null}
    </span>
  );
}
