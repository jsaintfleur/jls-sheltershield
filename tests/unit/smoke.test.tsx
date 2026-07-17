import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LandingPage from '@/app/(marketing)/page';

describe('ShelterShield landing page', () => {
  it('renders the product tagline and license flags', () => {
    render(<LandingPage />);

    expect(screen.getByText(/See displacement before it happens/i)).toBeInTheDocument();
    expect(screen.getByText(/Eviction Lab data is non-commercial/i)).toBeInTheDocument();
  });
});
