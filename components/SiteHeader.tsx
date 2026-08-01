import Link from "next/link";
import { ThemeToggle } from "@/lib/design/primitives";

const NAV = [
  { href: "/", label: "Executive Overview" },
  { href: "/methodology", label: "Methodology & Data" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 md:flex-nowrap">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-600)] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 19V9.5L12 4l8 5.5V19H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M8 19v-6h8v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--chrome-text)]">ShelterShield</span>
        </Link>
        <div className="order-2 md:order-3">
          <ThemeToggle />
        </div>
        <div className="order-3 w-full overflow-x-auto md:order-2 md:ml-auto md:w-auto md:overflow-visible">
          <nav aria-label="Primary" className="flex min-w-max items-center gap-1 md:justify-end">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--chrome-muted)] transition-colors hover:bg-[var(--chrome-hover)] hover:text-[var(--chrome-text)]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
