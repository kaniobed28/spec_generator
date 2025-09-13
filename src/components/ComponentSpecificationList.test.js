import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ComponentSpecificationList from './ComponentSpecificationList';

// Mock the API functions
jest.mock('../services/unifiedApi', () => ({
  unifiedApi: {
    component: {
      listByProject: jest.fn(),
      delete: jest.fn()
    }
  }
}));

const { unifiedApi } = require('../services/unifiedApi');

describe('ComponentSpecificationList', () => {
  const mockProjectId = 'project-123';
  const mockSpecifications = [
    {
      id: 'spec-1',
      componentName: 'Component One',
      projectId: 'project-123',
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'spec-2',
      componentName: 'Component Two',
      projectId: 'project-123',
      createdAt: '2023-01-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render loading state initially', () => {
    unifiedApi.component.listByProject.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId={mockProjectId} />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('should render empty state when no specifications exist', async () => {
    unifiedApi.component.listByProject.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId={mockProjectId} />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('No component specifications found. Create your first specification!')).toBeInTheDocument();
    });
    
    // Check that new specification button exists
    expect(screen.getByText('New Specification')).toBeInTheDocument();
  });

  test('should render list of specifications', async () => {
    unifiedApi.component.listByProject.mockResolvedValue(mockSpecifications);
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId={mockProjectId} />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Component Specifications')).toBeInTheDocument();
    });
    
    // Check that specifications are rendered
    expect(screen.getByText('Component One')).toBeInTheDocument();
    expect(screen.getByText('Component Two')).toBeInTheDocument();
    
    // Check dates are formatted correctly
    expect(screen.getByText('Created: 1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('Created: 1/2/2023')).toBeInTheDocument();
    
    // Check action buttons
    expect(screen.getAllByLabelText('view')).toHaveLength(2);
    expect(screen.getAllByLabelText('delete')).toHaveLength(2);
  });

  test('should show error when fetching specifications fails', async () => {
    unifiedApi.component.listByProject.mockRejectedValue(new Error('Failed to fetch'));
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId={mockProjectId} />
      </BrowserRouter>
    );
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load component specifications. Please try again.')).toBeInTheDocument();
    });
  });

  test('should delete specification when delete button is clicked', async () => {
    unifiedApi.component.listByProject.mockResolvedValue(mockSpecifications);
    unifiedApi.component.delete.mockResolvedValue({});
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId={mockProjectId} />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Component One')).toBeInTheDocument();
    });
    
    // Click delete button for first specification
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check that delete API was called
    expect(unifiedApi.component.delete).toHaveBeenCalledWith('spec-1');
    
    // Wait for specification to be removed from list
    await waitFor(() => {
      expect(screen.queryByText('Component One')).not.toBeInTheDocument();
    });
    
    // Second specification should still be there
    expect(screen.getByText('Component Two')).toBeInTheDocument();
  });

  test('should show error when deletion fails', async () => {
    unifiedApi.component.listByProject.mockResolvedValue(mockSpecifications);
    unifiedApi.component.delete.mockRejectedValue(new Error('Deletion failed'));
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId={mockProjectId} />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Component One')).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to delete component specification. Please try again.')).toBeInTheDocument();
    });
    
    // Specification should still be in the list
    expect(screen.getByText('Component One')).toBeInTheDocument();
  });
});