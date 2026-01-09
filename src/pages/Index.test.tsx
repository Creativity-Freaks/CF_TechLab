import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Stub heavy components and assets to reduce memory during tests
vi.mock('@/components/Hero', () => ({ Hero: () => <div /> }));
vi.mock('@/components/Services', () => ({ Services: () => <div /> }));
vi.mock('@/components/Header', () => ({ Header: () => <div /> }));
vi.mock('@/components/CTA', () => ({ CTA: () => <div /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div /> }));
vi.mock('@/components/Projects', () => ({ default: () => <div /> }));
vi.mock('@/components/FreakFlow', () => ({ default: () => <div /> }));
vi.mock('@/components/Testimonials', () => ({ default: () => <div /> }));
vi.mock('@/components/Partners', () => ({ default: () => <div /> }));
vi.mock('@/components/FAQ', () => ({ default: () => <div /> }));
vi.mock('@/components/Contact', () => ({ default: () => <div /> }));
vi.mock('@/assets/hero-tech.jpg', () => ({ default: 'hero-tech.jpg' }));
import Index from './Index';

// Mock data hooks to avoid Supabase/network during tests
vi.mock('@/hooks/useData', () => {
  return {
    useServices: () => ({
      data: [],
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn()
    })
  };
});

describe('Index page', () => {
  it('renders core sections', () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/"]}>
          <QueryClientProvider client={client}>
            <Index />
          </QueryClientProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
    // Basic smoke assertions against visible headings or elements
    expect(screen.getByText(/About CF TechLab/i)).toBeInTheDocument();
  });
});
