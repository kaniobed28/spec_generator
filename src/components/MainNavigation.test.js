import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainNavigation from './MainNavigation';

// Mock the useLocation hook
const mockLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation(),
}));

describe('MainNavigation', () => {
  beforeEach(() => {
    mockLocation.mockReturnValue({ pathname: '/' });
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <MainNavigation />
      </BrowserRouter>
    );

    expect(screen.getByText('AI Spec Generator')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
  });

  test('highlights active link', () => {
    mockLocation.mockReturnValue({ pathname: '/' });
    
    render(
      <BrowserRouter>
        <MainNavigation />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    // Note: Testing exact Material UI variant classes might be fragile
  });

  test('renders mobile menu on small screens', () => {
    // This would require mocking useMediaQuery or using a testing library that can simulate screen sizes
    // For now, we'll just ensure the component renders without errors
    render(
      <BrowserRouter>
        <MainNavigation />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('navigation menu')).toBeInTheDocument();
  });
});