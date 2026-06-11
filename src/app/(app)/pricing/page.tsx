"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Crown, X } from "lucide-react";

const freeFeatures = [
  { label: "1 resume analysis per month", included: true },
  { label: "Basic ATS score", included: true },
  { label: "Basic portfolio template", included: true },
  { label: "GitHub overview", included: true },
  { label: "Recruiter insights", included: false },
  { label: "Custom domain support", included: false },
  { label: "Export portfolio code", included: false },
];

const proFeatures = [
  { label: "Unlimited resume analysis", included: true },
  { label: "Premium resume templates", included: true },
  { label: "Recruiter insights", included: true },
  { label: "AI optimization credits", included: true },
  { label: "Advanced GitHub analysis", included: true },
  { label: "Custom domain support", included: true },
  { label: "Export portfolio code", included: true },
];

function PricingPageContent() {
  const searchParams = useSearchParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkoutStatus = searchParams.get("status");
  const checkoutNotice = useMemo(() => {
    if (checkoutStatus === "return") {
      return "Payment flow returned. Your plan will unlock after Dodo confirms the payment.";
    }

    if (checkoutStatus === "cancelled") {
      return "Checkout was cancelled.";
    }

    return null;
  }, [checkoutStatus]);

  async function handleUpgrade() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
      });

      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || "Could not start checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Could not start checkout.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative space-y-6 pb-6">
      {checkoutNotice ? (
        <div className="mx-auto max-w-[960px] rounded-[18px] border border-[rgba(214,173,96,0.2)] bg-[rgba(214,173,96,0.08)] px-4 py-3 text-sm text-[#FAF3E0]">
          {checkoutNotice}
        </div>
      ) : null}

      {error ? (
        <div className="mx-auto max-w-[960px] rounded-[18px] border border-[rgba(192,132,87,0.22)] bg-[rgba(192,132,87,0.08)] px-4 py-3 text-sm text-[#FAF3E0]">
          {error}
        </div>
      ) : null}

      {isPaymentModalOpen ? (
        <>
          <button
            type="button"
            aria-label="Close payment modal overlay"
            className="fixed inset-0 z-30 bg-black/60"
            onClick={() => setIsPaymentModalOpen(false)}
          />
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
            <div className="w-full max-w-[520px] rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                    Upgrade to Pro
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    ₹299/month
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#D6D3D1]">
                    Unlock unlimited resume analysis, premium portfolio templates,
                    and recruiter insights.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close payment modal"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(250,243,224,0.08)] bg-[#221e1d] text-[#D6AD60]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60]"
                >
                  {isSubmitting ? "Starting checkout..." : "Continue to Dodo Payments"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(250,243,224,0.12)] px-5 py-3 text-sm font-medium text-[#FAF3E0] transition hover:border-[rgba(250,243,224,0.18)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <section className="mx-auto max-w-[940px] text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-[#D6AD60]">Pricing</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Start free. Upgrade when you&apos;re ready.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#D6D3D1] sm:text-[15px]">
          Choose the plan that helps you analyze better, build faster, and stand
          out to recruiters.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1040px] items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="flex h-full flex-col rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
          <div className="min-h-[136px]">
            <p className="text-sm font-medium text-[#FAF3E0]">Free Plan</p>
            <p className="mt-3 flex items-end gap-1 text-4xl font-semibold tracking-tight text-white">
              <span>₹0</span>
              <span className="mb-1 text-lg font-normal text-[#D6D3D1]">
                /month
              </span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#D6D3D1]">
              For trying HireMe AI and running your first analysis.
            </p>
          </div>

          <div className="mt-5 min-h-[252px] space-y-2.5">
            {freeFeatures.map((feature) => (
              <div
                key={feature.label}
                className={`flex items-center gap-3 text-sm ${feature.included ? "text-[#D6D3D1]" : "text-[#8B8681]"}`}
              >
                {feature.included ? (
                  <Check className="h-4 w-4 shrink-0 text-[#D6AD60]" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-[#6E675F]" />
                )}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(250,243,224,0.12)] px-5 py-3 text-sm font-medium text-[#FAF3E0] transition hover:border-[rgba(250,243,224,0.18)]"
            >
              Start Free
            </button>
          </div>
        </article>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(192,132,87,0.08),transparent_65%)]" />
          <article className="relative h-full rounded-[28px] bg-[linear-gradient(135deg,rgba(139,94,60,0.5),rgba(192,132,87,0.28),rgba(250,243,224,0.16))] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="flex h-full flex-col rounded-[27px] bg-[#292524] p-6">
              <div className="h-1 rounded-full bg-[linear-gradient(135deg,#8B5E3C,#C08457,#FAF3E0)]" />
              <div className="mt-6 min-h-[136px]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] bg-[rgba(192,132,87,0.12)] px-3 py-1.5 text-xs font-medium text-[#FAF3E0]">
                    <Crown className="h-3.5 w-3.5 text-[#D6AD60]" />
                    Most Popular
                  </div>
                  <p className="mt-4 text-sm font-medium text-[#FAF3E0]">Pro Plan</p>
                  <p className="mt-3 flex items-end gap-1 text-5xl font-semibold tracking-tight text-white">
                    <span>₹299</span>
                    <span className="mb-1 text-lg font-normal text-[#D6D3D1]">
                      /month
                    </span>
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-[#D6D3D1]">
                    For serious applicants who want deeper AI insights.
                  </p>
                </div>
              </div>

              <div className="mt-5 min-h-[252px] space-y-2.5">
                {proFeatures.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 text-sm text-[#D6D3D1]"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#D6AD60]" />
                    <span>{feature.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60]"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-[960px] rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-6 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="grid gap-4 text-center sm:grid-cols-2 sm:text-left">
          <div>
            <p className="text-sm font-medium text-[#FAF3E0]">Free</p>
            <p className="mt-1 text-sm text-[#D6D3D1]">Basic career setup</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#FAF3E0]">Pro</p>
            <p className="mt-1 text-sm text-[#D6D3D1]">Full recruiter-ready toolkit</p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-[#D6D3D1]">
        Premium features unlock after successful payment.
      </p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-[240px]" />}>
      <PricingPageContent />
    </Suspense>
  );
}
