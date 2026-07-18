import React from "react";

export const metadata = { title: "About — ShelterShield" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">About ShelterShield</h1>

      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        <p>
          Community-development capital is scarce and lumpy, and the hardest question a lender or city agency
          faces is <em>where</em> to deploy preservation versus production dollars <em>before</em> a neighborhood
          tips into displacement. Move too early and subsidy is wasted; move too late and affordability is lost
          for good. Most dashboards describe what already happened. ShelterShield is built to look forward and to
          be defensible in front of an investment committee.
        </p>
        <p>
          It turns public housing and land data into a transparent, tract-level risk score and a ranked,
          explainable list of where capital protects the most affordable housing per dollar — with every number
          traceable to its source and every limitation stated plainly.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">Who it&apos;s for</h2>
        <p>
          CDFI capital-deployment and underwriting teams, city housing-agency planners, community-development
          lenders, housing philanthropy, and policy shops that need a shared, auditable basis for targeting
          investment.
        </p>

        <h2 className="pt-4 text-xl font-semibold tracking-tight text-ink">About the author</h2>
        <p>
          ShelterShield is the flagship of a five-product data portfolio by <b>Jean-Luc Saint-Fleur</b>, spanning
          housing, financial services, healthcare, retail, and transportation &amp; climate. Each product takes a
          real business problem, credible public data, a defensible analytical method, and an executive-ready
          interface — and is honest about what the data can and cannot support. This project draws on Jean-Luc&apos;s
          community-development domain experience while using only public data.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-panel p-5 text-sm">
          <p className="font-semibold text-ink">Built with</p>
          <p className="mt-1.5 text-ink-muted">
            Next.js 15 · TypeScript · Tailwind CSS · MapLibre GL · Python (Pandas) · NYC Open Data. Deployed on Vercel.
          </p>
        </div>
      </div>
    </div>
  );
}
