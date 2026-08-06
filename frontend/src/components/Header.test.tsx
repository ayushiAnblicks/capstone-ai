import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

function renderHeader(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders the app title', () => {
    renderHeader();
    expect(screen.getByText('DocAI')).toBeInTheDocument();
  });

  it('renders Upload and History navigation links', () => {
    renderHeader();
    expect(screen.getAllByText('Upload').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('History').length).toBeGreaterThanOrEqual(1);
  });

  it('applies active class to Upload link when on /', () => {
    renderHeader('/');
    const desktopNav = screen.getByRole('navigation', { name: 'Main navigation' });
    const uploadLink = desktopNav.querySelector('a[href="/"]');
    expect(uploadLink).toHaveClass('text-blue-600', 'font-semibold');
  });

  it('applies active class to History link when on /history', () => {
    renderHeader('/history');
    const desktopNav = screen.getByRole('navigation', { name: 'Main navigation' });
    const historyLink = desktopNav.querySelector('a[href="/history"]');
    expect(historyLink).toHaveClass('text-blue-600', 'font-semibold');
  });

  it('applies inactive class to History link when on /', () => {
    renderHeader('/');
    const desktopNav = screen.getByRole('navigation', { name: 'Main navigation' });
    const historyLink = desktopNav.querySelector('a[href="/history"]');
    expect(historyLink).toHaveClass('text-gray-600');
    expect(historyLink).not.toHaveClass('font-semibold');
  });

  it('has correct header styling', () => {
    renderHeader();
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'border-b', 'border-gray-200', 'px-4', 'py-3');
  });

  it('shows mobile menu toggle button', () => {
    renderHeader();
    const toggleBtn = screen.getByLabelText('Toggle navigation');
    expect(toggleBtn).toBeInTheDocument();
  });

  it('toggles mobile nav on button click', () => {
    renderHeader();
    const toggleBtn = screen.getByLabelText('Toggle navigation');

    // Mobile nav should not be visible initially
    const navsBefore = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navsBefore).toHaveLength(1); // only desktop nav

    // Click to open
    fireEvent.click(toggleBtn);
    const navsAfter = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navsAfter).toHaveLength(2); // desktop + mobile

    // Click to close
    fireEvent.click(toggleBtn);
    const navsAfterClose = screen.getAllByRole('navigation', { name: 'Main navigation' });
    expect(navsAfterClose).toHaveLength(1);
  });
});
