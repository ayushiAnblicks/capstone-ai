import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Layout } from './Layout';

describe('Layout', () => {
  it('renders the application title', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Upload Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('DocuExtract')).toBeInTheDocument();
  });

  it('renders the Outlet content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Upload Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Upload Page Content')).toBeInTheDocument();
  });

  it('has min-h-screen and bg-gray-50 on wrapper', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  it('has correct main container styling', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const main = screen.getByRole('main');
    expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');
  });

  it('renders nested route content in main', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Upload</div>} />
            <Route path="history" element={<div>History Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('History Page');
  });

  it('renders navigation links for Upload and History', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    // Desktop nav should have the links (hidden on mobile via CSS)
    const navLinks = screen.getAllByRole('link');
    const linkTexts = navLinks.map((link) => link.textContent);
    expect(linkTexts).toContain('Upload');
    expect(linkTexts).toContain('History');
  });

  it('has a mobile menu toggle button', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toBeInTheDocument();
  });
});
