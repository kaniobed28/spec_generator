import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BreadcrumbsNav from './BreadcrumbsNav';

// Mock useMediaQuery to control responsive behavior in tests
jest.mock('@mui/material/useMediaQuery', () => () => false);

// Mock the useLocation hook
const mockLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation(),
}));

describe('BreadcrumbsNav', () => {
  beforeEach(() => {
    mockLocation.mockReturnValue({ pathname: '/' });
  });

  test('renders home breadcrumb', () => {
    mockLocation.mockReturnValue({ pathname: '/' });
    
    render(
      <BrowserRouter>
        <BreadcrumbsNav />
      </BrowserRouter>
    );

    // On home page, breadcrumbs should not render
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  test('renders breadcrumbs for nested routes', () => {
    mockLocation.mockReturnValue({ pathname: '/projects/123/specifications' });
    
    render(
      <BrowserRouter>
        <BreadcrumbsNav />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Component Specifications')).toBeInTheDocument();
  });

  test('renders breadcrumbs with correct links', () => {
    mockLocation.mockReturnValue({ pathname: '/projects/123/specifications' });
    
    render(
      <BrowserRouter>
        <BreadcrumbsNav />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});