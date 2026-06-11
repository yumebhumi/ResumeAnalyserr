import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-[#1C1917] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative flex flex-col items-center text-center"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100 blur-[120px]"
            style={{ background: "rgba(192,132,87,0.08)" }}
          />
          <h2 className="max-w-[700px] text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:text-[64px]">
            Ready to land your next opportunity?
          </h2>
          <p className="mt-6 max-w-[500px] text-base leading-7 text-[#D6D3D1] sm:text-lg">
            Analyze your resume. Build your portfolio. Stand out to recruiters.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full px-8 py-4 shadow-[0_8px_24px_rgba(192,132,87,0.16)] hover:bg-[#D6AD60]"
          >
            <Link href="/analyze">Start Free</Link>
          </Button>
        </motion.div>

        <div className="mt-14 border-t border-[rgba(250,243,224,0.08)] pt-6">
          <div className="flex flex-col gap-5 text-sm text-[#D6D3D1] lg:flex-row lg:items-center lg:justify-between">
            <div className="text-left">
              <p className="font-medium text-white">HireMe AI</p>
              <p className="mt-2">© 2026 HireMe AI</p>
            </div>

            <div className="text-left lg:text-center">
              <p>Land More Interviews with AI</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-end">
              <Link
                href="https://github.com/yumebhumi"
                className="text-[#D6D3D1] transition hover:text-white"
                aria-label="GitHub"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                >
                  <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.082 3.292 9.395 7.861 10.916.575.106.786-.25.786-.556 0-.275-.011-1.184-.016-2.147-3.199.695-3.874-1.356-3.874-1.356-.523-1.328-1.278-1.682-1.278-1.682-1.045-.714.079-.699.079-.699 1.156.081 1.764 1.187 1.764 1.187 1.027 1.761 2.694 1.252 3.35.957.104-.744.402-1.253.731-1.541-2.553-.29-5.238-1.277-5.238-5.684 0-1.255.449-2.281 1.184-3.085-.119-.29-.513-1.459.113-3.043 0 0 .965-.309 3.162 1.178A10.958 10.958 0 0 1 12 6.03c.973.005 1.954.132 2.87.388 2.195-1.487 3.159-1.178 3.159-1.178.628 1.584.234 2.753.115 3.043.737.804 1.182 1.83 1.182 3.085 0 4.418-2.69 5.39-5.25 5.676.413.355.781 1.052.781 2.12 0 1.531-.014 2.764-.014 3.141 0 .309.207.668.791.555C20.21 21.392 23.5 17.08 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
                </svg>
              </Link>
              <Link
                href="https://x.com/coldcoffeecoder"
                className="text-[#D6D3D1] transition hover:text-white"
                aria-label="X"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                >
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.29 19.494h2.04L6.485 3.24H4.298L17.61 20.647Z" />
                </svg>
              </Link>
              <Link href="/" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/" className="transition hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
