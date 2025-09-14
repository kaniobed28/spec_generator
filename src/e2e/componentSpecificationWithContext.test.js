import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ComponentSpecificationGenerator from '../components/ComponentSpecificationGenerator';

// Mock all API functions
jest.mock('../services/unifiedApi', () => ({
  unifiedApi: {
    specification: {
      getByProjectId: jest.fn()
    },
    component: {
      get: jest.fn(),
      create: jest.fn(),
      listByProject: jest.fn()
    },
    ai: {
      generateComponentRequirements: jest.fn(),
      generateComponentDesign: jest.fn(),
      generateComponentTasks: jest.fn()
    }
  }
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'project-123' }),
  useNavigate: () => jest.fn()
}));

const { unifiedApi } = require('../services/unifiedApi');

describe('End-to-End Component Specification Generation with Project Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  test('should complete the full component specification generation flow with project context', async () => {
    // Mock API responses with project specification context
    const mockProjectSpecification = {
      id: 'spec-456',
      title: 'Test Project',
      sections: {
        planning: { content: 'Project planning content' },
        design: { content: 'Project design content' },
        implementation: { content: 'Project implementation content' },
        tasks: { content: 'Project tasks content' }
      }
    };
    
    // Mock project specification fetch
    unifiedApi.specification.getByProjectId.mockResolvedValue(mockProjectSpecification);
    
    // Mock component API responses
    unifiedApi.component.listByProject.mockResolvedValue([]);
    unifiedApi.ai.generateComponentRequirements.mockResolvedValue('WHEN user accesses component with context\nTHE SYSTEM SHALL align with project design');
    unifiedApi.ai.generateComponentDesign.mockResolvedValue('# Design with Context\n\n## Architecture\n\nComponent architecture aligned with project');
    unifiedApi.ai.generateComponentTasks.mockResolvedValue('# Tasks with Context\n\n1. Implement UI aligned with project\n2. Add tests following project standards');
    unifiedApi.component.create.mockResolvedValue({
      id: 'comp-spec-123',
      componentName: 'Test Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456',
      requirements: { content: 'WHEN user accesses component with context\nTHE SYSTEM SHALL align with project design' },
      design: { content: '# Design with Context\n\n## Architecture\n\nComponent architecture aligned with project' },
      tasks: { content: '# Tasks with Context\n\n1. Implement UI aligned with project\n2. Add tests following project standards' }
    });
    unifiedApi.component.get.mockResolvedValue({
      id: 'comp-spec-123',
      componentName: 'Test Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456',
      requirements: { content: 'WHEN user accesses component with context\nTHE SYSTEM SHALL align with project design' },
      design: { content: '# Design with Context\n\n## Architecture\n\nComponent architecture aligned with project' },
      tasks: { content: '# Tasks with Context\n\n1. Implement UI aligned with project\n2. Add tests following project standards' }
    });
    
    // Mock useNavigate to track navigation
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    
    // Render component specification generator
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator />
      </BrowserRouter>
    );
    
    // Wait for project specification to be fetched
    await waitFor(() => {
      expect(unifiedApi.specification.getByProjectId).toHaveBeenCalledWith('project-123');
    });
    
    // Check that project context information is displayed
    expect(screen.getByText(/Generating specifications with project context: Test Project/)).toBeInTheDocument();
    
    // Fill in component form
    const componentNameInput = screen.getByLabelText('Component Name');
    fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
    
    const componentDescriptionInput = screen.getByLabelText('Component Description');
    fireEvent.change(componentDescriptionInput, { target: { value: 'A test component description that is long enough' } });
    
    // Generate specifications
    const generateButton = screen.getByText('Generate Specifications');
    fireEvent.click(generateButton);
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByText('Specifications generated successfully!')).toBeInTheDocument();
    });
    
    // Check that generated content is displayed
    expect(screen.getByText('WHEN user accesses component with context')).toBeInTheDocument();
    expect(screen.getByText('Component architecture aligned with project')).toBeInTheDocument();
    expect(screen.getByText('Implement UI aligned with project')).toBeInTheDocument();
    
    // Check that AI functions were called with project context
    expect(unifiedApi.ai.generateComponentRequirements).toHaveBeenCalledWith(
      'Test Component',
      'A test component description that is long enough',
      mockProjectSpecification
    );
    
    expect(unifiedApi.ai.generateComponentDesign).toHaveBeenCalledWith(
      'Test Component',
      'A test component description that is long enough',
      'WHEN user accesses component with context\nTHE SYSTEM SHALL align with project design',
      mockProjectSpecification
    );
    
    expect(unifiedApi.ai.generateComponentTasks).toHaveBeenCalledWith(
      'Test Component',
      'A test component description that is long enough',
      '# Design with Context\n\n## Architecture\n\nComponent architecture aligned with project',
      mockProjectSpecification
    );
    
    // Save specifications
    const saveButton = screen.getByText('Save Specifications');
    fireEvent.click(saveButton);
    
    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByText('Specifications saved successfully!')).toBeInTheDocument();
    });
    
    // Check that create function was called with project specification reference
    expect(unifiedApi.component.create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectSpecificationId: 'spec-456'
      })
    );
  });

  test('should generate specifications without project context when project specification is not found', async () => {
    // Mock API responses - no project specification found
    unifiedApi.specification.getByProjectId.mockResolvedValue(null);
    
    // Mock component API responses
    unifiedApi.component.listByProject.mockResolvedValue([]);
    unifiedApi.ai.generateComponentRequirements.mockResolvedValue('WHEN user accesses component\nTHE SYSTEM SHALL display details');
    unifiedApi.ai.generateComponentDesign.mockResolvedValue('# Design\n\n## Architecture\n\nComponent architecture');
    unifiedApi.ai.generateComponentTasks.mockResolvedValue('# Tasks\n\n1. Implement UI\n2. Add tests');
    
    // Render component specification generator
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator />
      </BrowserRouter>
    );
    
    // Wait for project specification fetch attempt
    await waitFor(() => {
      expect(unifiedApi.specification.getByProjectId).toHaveBeenCalledWith('project-123');
    });
    
    // Check that warning is displayed
    expect(screen.getByText(/No project specification found/)).toBeInTheDocument();
    
    // Fill in component form
    const componentNameInput = screen.getByLabelText('Component Name');
    fireEvent.change(componentNameInput, { target: { value: 'Test Component' } });
    
    const componentDescriptionInput = screen.getByLabelText('Component Description');
    fireEvent.change(componentDescriptionInput, { target: { value: 'A test component description that is long enough' } });
    
    // Generate specifications
    const generateButton = screen.getByText('Generate Specifications');
    fireEvent.click(generateButton);
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByText('Specifications generated successfully!')).toBeInTheDocument();
    });
    
    // Check that AI functions were called without project context
    expect(unifiedApi.ai.generateComponentRequirements).toHaveBeenCalledWith(
      'Test Component',
      'A test component description that is long enough',
      null
    );
    
    expect(unifiedApi.ai.generateComponentDesign).toHaveBeenCalledWith(
      'Test Component',
      'A test component description that is long enough',
      'WHEN user accesses component\nTHE SYSTEM SHALL display details',
      null
    );
    
    expect(unifiedApi.ai.generateComponentTasks).toHaveBeenCalledWith(
      'Test Component',
      'A test component description that is long enough',
      '# Design\n\n## Architecture\n\nComponent architecture',
      null
    );
  });
});