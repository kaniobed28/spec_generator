import React from 'react';
import { render, screen } from '@testing-library/react';
import { SpecificationProvider, useSpecification } from './SpecificationContext';

// Test component to use the context
const TestComponent = () => {
  const context = useSpecification();
  return (
    <div>
      <span data-testid="projects-count">{context.projects.length}</span>
      <span data-testid="loading-projects">{context.loading.projects.toString()}</span>
      <span data-testid="error">{context.error || 'null'}</span>
    </div>
  );
};

describe('SpecificationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides initial state', () => {
    render(
      <SpecificationProvider>
        <TestComponent />
      </SpecificationProvider>
    );

    expect(screen.getByTestId('projects-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading-projects')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });
});