import React from 'react';
import { ArrowRight, Building2, LineChart, MapPinned, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LicenseFlagBanner } from '@/components/LicenseFlagBanner';

const decisions = [
  'Target preservation and production capital by cycle',
  'Flag currently-affordable tracts at near-term displacement risk',
  'Rank candidate deals by community-impact-per-dollar',
  'Choose between capital projects and tenant-protection instruments',
  'Defend allocations with decomposable, reproducible scores'
];

const pillars = [
  {
    icon: MapPinned,
    title: 'Forward-looking tract risk',
    body: 'A census-tract displacement-risk composite index built from public housing, eviction, affordability, market, and distress signals.'
  },
  {
    icon: LineChart,
    title: 'Validated methodology',
    body: 'Three weighting schemes, geometric-mean aggregation, Cronbach alpha, Monte Carlo sensitivity, and predictive back-test deliverables.'
  },
  {
    icon: Building2,
    title: 'NYC building drill-down',
    body: 'A national tract method with a fully worked NYC deep-dive that rolls BBL-level evictions, PLUTO, and housing distress to tract context.'
  },
  {
    icon: ShieldCheck,
    title: 'Capital prioritization',
    body: 'A Preserve / Produce / Protect / Monitor archetype engine connected to impact-per-dollar ranking.'
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 lg:px-10">
        <nav className="flex items-center justify-between border-b border-border-subtle pb-5" aria-label="Primary">
          <a className="flex items-center gap-3 font-semibold text-text-primary" href="/">
            <span className="grid size-9 place-items-center rounded-md bg-accent-600 text-sm text-white">SS</span>
            ShelterShield
          </a>
          <div className="hidden items-center gap-5 text-sm font-medium text-text-secondary md:flex">
            <a href="/overview">Overview</a>
            <a href="/explorer">Explorer</a>
            <a href="/prioritization">Prioritization</a>
            <a href="/methodology">Methodology</a>
            <a href="/about">About</a>
          </div>
        </nav>

        <LicenseFlagBanner />

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center rounded-xl border border-border-subtle bg-surface p-8 shadow-sm lg:p-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-accent-700">
              Community-development capital intelligence
            </p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.02em] text-text-primary md:text-6xl">
              See displacement before it happens. Put capital where it holds communities.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              ShelterShield turns public housing and market data into a transparent, validated tract-risk index and
              capital-prioritization workflow for CDFIs, housing agencies, philanthropy, and preservation teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href="/overview">
                  Open executive overview <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/methodology">Review methodology</a>
              </Button>
            </div>
          </div>

          <aside className="rounded-xl border border-border-subtle bg-surface p-6 shadow-sm" aria-labelledby="decisions">
            <h2 id="decisions" className="text-xl font-semibold text-text-primary">
              Five decisions ShelterShield supports
            </h2>
            <ol className="mt-5 space-y-3">
              {decisions.map((decision, index) => (
                <li key={decision} className="flex gap-3 rounded-lg bg-inset p-3 text-sm text-text-secondary">
                  <span className="font-mono text-accent-700">{String(index + 1).padStart(2, '0')}</span>
                  <span>{decision}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Product pillars">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rounded-xl border border-border-subtle bg-surface p-5 shadow-xs">
                <Icon aria-hidden="true" className="mb-4 size-6 text-accent-700" />
                <h2 className="text-base font-semibold text-text-primary">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{pillar.body}</p>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
