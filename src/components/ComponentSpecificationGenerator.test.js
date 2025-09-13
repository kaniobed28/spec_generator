import React from 'react';
import { render, screen } from '@testing-library/react';
import ComponentSpecificationGenerator from './ComponentSpecificationGenerator';

// Simple test to check if the component renders
describe('ComponentSpecificationGenerator', () => {
  test('renders component specification generator form', () => {
    // Mock the hooks that are used in the component
    jest.mock('react-router-dom', () => ({
      useNavigate: () => jest.fn(),
      useParams: () => ({ id: 'test-project-id' })
    }));
    
    jest.mock('../contexts/SpecificationContext', () => ({
      useSpecification: () => ({
        loading: { general: false },
        error: null,
        setError: jest.fn(),
        clearError: jest.fn(),
        createComponentSpecification: jest.fn()
      })
    }));

    render(<ComponentSpecificationGenerator />);
    
    expect(screen.getByText('Component Specification Generator')).toBeInTheDocument();
    expect(screen.getByLabelText('Component Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Component Description')).toBeInTheDocument();
    expect(screen.getByText('Generate Specifications')).toBeInTheDocument();
  });
});
