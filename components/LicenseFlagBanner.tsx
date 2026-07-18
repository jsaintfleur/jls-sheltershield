import React from 'react';

export function LicenseFlagBanner() {
  return (
    <aside className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100" role="note">
      <strong className="font-semibold">Data-license flags:</strong> Eviction Lab data is non-commercial and
      attribution-required. HUD datasets are handled under a stated public-federal-data assumption because no explicit
      open-data license is posted.
    </aside>
  );
}
