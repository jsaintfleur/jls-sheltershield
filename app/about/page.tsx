import React from "react";

export const metadata = { title: "About — ShelterShield" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-12 pt-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-text)]">About ShelterShield</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">A capital-targeting tool for preserving affordability before it disappears.</h1>

      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
        <p>
          Community-development capital is scarce, and the highest-stakes question is where to deploy preservation versus production dollars before a neighborhood tips into displacement. Most dashboards describe what already happened. ShelterShield gives a defensible first screen for what to investigate next.
        </p>
        <p>
          It turns public housing, land, and eviction data into a tract-level risk score, a capital action archetype, an interactive budget what-if, and a ranked target list that can move into underwriting or planning review.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-[var(--text-primary)]">Who it&apos;s for</h2>
        <p>
          CDFI capital-deployment teams, city housing planners, community-development lenders, housing philanthropy, and policy teams that need a shared, auditable basis for targeting investment.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-[var(--text-primary)]">About the author</h2>
        <p>
          ShelterShield is the flagship of a five-product data portfolio by <b>Jean-Luc Saint-Fleur</b>, spanning housing, financial services, healthcare, retail, and transportation and climate. Each product pairs a real business problem, credible public data, a defensible analytical method, and an executive-ready interface.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5 text-sm">
          <p className="font-semibold text-[var(--text-primary)]">Built with</p>
          <p className="mt-1.5 text-[var(--text-tertiary)]">
            Next.js 15 · TypeScript · Tailwind CSS · TanStack Table · MapLibre GL · Python (Pandas) · NYC Open Data. Deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}
