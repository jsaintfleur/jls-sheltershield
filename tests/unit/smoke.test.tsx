import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OverviewPage from '@/app/page';

describe('ShelterShield overview page', () => {
  it('renders the executive overview and license flags', () => {
    render(<OverviewPage />);

    expect(screen.getByText(/See displacement before it happens/i)).toBeInTheDocument();
    expect(screen.getByText(/Eviction Lab data is non-commercial/i)).toBeInTheDocument();
  });
});
