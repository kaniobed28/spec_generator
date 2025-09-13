import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ComponentSpecificationViewer from './ComponentSpecificationViewer';

// Mock the API functions
jest.mock('../services/unifiedApi', () => ({
  unifiedApi: {
    component: {
      get: jest.fn(),
      update: jest.fn()
    },
    ai: {
      generateComponentRequirements: jest.fn(),
      generateComponentDesign: jest.fn(),
      generateComponentTasks: jest.fn()
    }
  }
}));

const { unifiedApi } = require('../services/unifiedApi');

// Mock react-router-dom useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'spec-123'
  })
}));

describe('ComponentSpecificationViewer', () => {
  const mockSpecification = {
    id: 'spec-123',
    componentName: 'Test Component',
    projectId: 'project-123',
    componentDescription: 'A test component',
    requirements: {
      content: 'WHEN user accesses the component\nTHE SYSTEM SHALL display the component details'
    },
    design: {
      content: '# Design\n\n## Architecture\n\nComponent architecture details'
    },
    tasks: {
      content: '# Tasks\n\n1. Implement component UI\n2. Add unit tests'
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render loading state initially', () => {
    unifiedApi.component.get.mockResolvedValue(null);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should render component specification details', async () => {
    unifiedApi.component.get.mockResolvedValue(mockSpecification);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
    
    // Check tabs are rendered
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    
    // Check export buttons
    expect(screen.getByText('Export All')).toBeInTheDocument();
  });

  test('should show error when fetching specification fails', async () => {
    unifiedApi.component.get.mockRejectedValue(new Error('Failed to fetch'));
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load component specification. Please try again.')).toBeInTheDocument();
    });
  });

  test('should show not found message when specification does not exist', async () => {
    unifiedApi.component.get.mockResolvedValue(null);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    // Wait for not found message
    await waitFor(() => {
      expect(screen.getByText('Component specification not found.')).toBeInTheDocument();
    });
  });

  test('should regenerate specifications when regenerate button is clicked', async () => {
    unifiedApi.component.get.mockResolvedValue(mockSpecification);
    
    // Mock regeneration responses
    unifiedApi.ai.generateComponentRequirements.mockResolvedValue('New requirements');
    unifiedApi.ai.generateComponentDesign.mockResolvedValue('New design');
    unifiedApi.ai.generateComponentTasks.mockResolvedValue('New tasks');
    unifiedApi.component.update.mockResolvedValue({
      ...mockSpecification,
      requirements: { content: 'New requirements' },
      design: { content: 'New design' },
      tasks: { content: 'New tasks' }
    });
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
    
    // Click regenerate button
    const regenerateButton = screen.getByText('Regenerate');
    fireEvent.click(regenerateButton);
    
    // Wait for regeneration to complete
    await waitFor(() => {
      expect(screen.getByText('Specifications regenerated successfully!')).toBeInTheDocument();
    });
    
    // Check that API functions were called
    expect(unifiedApi.ai.generateComponentRequirements).toHaveBeenCalledWith('Test Component', 'A test component');
    expect(unifiedApi.ai.generateComponentDesign).toHaveBeenCalledWith('Test Component', 'A test component', 'New requirements');
    expect(unifiedApi.ai.generateComponentTasks).toHaveBeenCalledWith('Test Component', 'A test component', 'New design');
    expect(unifiedApi.component.update).toHaveBeenCalled();
  });

  test('should show error when regeneration fails', async () => {
    unifiedApi.component.get.mockResolvedValue(mockSpecification);
    
    // Mock regeneration failure
    enhancedApi.generateComponentRequirements.mockRejectedValue(new Error('Regeneration failed'));
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
    
    // Click regenerate button
    const regenerateButton = screen.getByText('Regenerate');
    fireEvent.click(regenerateButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to regenerate specifications. Please try again.')).toBeInTheDocument();
    });
  });
});