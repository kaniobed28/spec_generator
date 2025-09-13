import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock all API functions
jest.mock('../services/api', () => ({
  specificationApi: {
    generateSpecifications: jest.fn(),
    getSpecifications: jest.fn()
  }
}));

jest.mock('../services/unifiedApi', () => ({
  unifiedApi: {
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
  useParams: () => ({}),
  useNavigate: () => jest.fn()
}));

const { specificationApi } = require('../services/api');
const { unifiedApi } = require('../services/unifiedApi');

describe('End-to-End Specification Generation Flow', () => {
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

  test('should complete the full project specification generation flow', async () => {
    // Mock API responses
    const mockProjectResponse = {
      project: {
        id: 'project-123',
        name: 'Test Project',
        description: 'A test project'
      },
      specification: {
        id: 'spec-123',
        projectId: 'project-123',
        title: 'Test Project',
        sections: {
          planning: { title: 'Planning', content: 'Planning content' },
          design: { title: 'Design', content: 'Design content' },
          implementation: { title: 'Implementation', content: 'Implementation content' },
          tasks: { title: 'Tasks', content: 'Tasks content' }
        }
      }
    };
    
    specificationApi.generateSpecifications.mockResolvedValue(mockProjectResponse);
    specificationApi.getSpecifications.mockResolvedValue(mockProjectResponse.specification);
    
    // Render the app
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Fill in project form
    const projectNameInput = screen.getByLabelText('Project Name');
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } });
    
    const projectDescriptionInput = screen.getByLabelText('Project Description');
    fireEvent.change(projectDescriptionInput, { target: { value: 'A test project description' } });
    
    // Submit form
    const generateButton = screen.getByText('Generate Specifications');
    fireEvent.click(generateButton);
    
    // Wait for navigation to specifications view
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
    
    // Check that specification sections are displayed
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Implementation')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    
    // Check that component specs link exists
    expect(screen.getByText('Component Specs')).toBeInTheDocument();
  });

  test('should complete the full component specification generation flow', async () => {
    // Mock API responses
    unifiedApi.component.listByProject.mockResolvedValue([]);
    unifiedApi.ai.generateComponentRequirements.mockResolvedValue('WHEN user accesses component\nTHE SYSTEM SHALL display details');
    unifiedApi.ai.generateComponentDesign.mockResolvedValue('# Design\n\n## Architecture\n\nComponent architecture');
    unifiedApi.ai.generateComponentTasks.mockResolvedValue('# Tasks\n\n1. Implement UI\n2. Add tests');
    unifiedApi.component.create.mockResolvedValue({
      id: 'comp-spec-123',
      componentName: 'Test Component',
      projectId: 'project-123',
      requirements: { content: 'WHEN user accesses component\nTHE SYSTEM SHALL display details' },
      design: { content: '# Design\n\n## Architecture\n\nComponent architecture' },
      tasks: { content: '# Tasks\n\n1. Implement UI\n2. Add tests' }
    });
    unifiedApi.component.get.mockResolvedValue({
      id: 'comp-spec-123',
      componentName: 'Test Component',
      projectId: 'project-123',
      requirements: { content: 'WHEN user accesses component\nTHE SYSTEM SHALL display details' },
      design: { content: '# Design\n\n## Architecture\n\nComponent architecture' },
      tasks: { content: '# Tasks\n\n1. Implement UI\n2. Add tests' }
    });
    
    // Mock useNavigate to track navigation
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
    
    // Render component specification generator
    const ComponentSpecificationGenerator = require('../components/ComponentSpecificationGenerator').default;
    
    render(
      <BrowserRouter>
        <ComponentSpecificationGenerator projectId="project-123" />
      </BrowserRouter>
    );
    
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
    expect(screen.getByText('WHEN user accesses component')).toBeInTheDocument();
    expect(screen.getByText('Component architecture')).toBeInTheDocument();
    expect(screen.getByText('Implement UI')).toBeInTheDocument();
    
    // Save specifications
    const saveButton = screen.getByText('Save Specifications');
    fireEvent.click(saveButton);
    
    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByText('Specifications saved successfully!')).toBeInTheDocument();
    });
    
    // Check that API functions were called correctly
    expect(unifiedApi.ai.generateComponentRequirements).toHaveBeenCalledWith('Test Component', 'A test component description that is long enough');
    expect(unifiedApi.ai.generateComponentDesign).toHaveBeenCalledWith('Test Component', 'A test component description that is long enough', 'WHEN user accesses component\nTHE SYSTEM SHALL display details');
    expect(unifiedApi.ai.generateComponentTasks).toHaveBeenCalledWith('Test Component', 'A test component description that is long enough', '# Design\n\n## Architecture\n\nComponent architecture');
    expect(unifiedApi.component.create).toHaveBeenCalled();
  });

  test('should display component specifications list', async () => {
    // Mock API responses
    const mockSpecifications = [
      {
        id: 'comp-spec-1',
        componentName: 'Component One',
        projectId: 'project-123',
        createdAt: '2023-01-01T00:00:00Z'
      },
      {
        id: 'comp-spec-2',
        componentName: 'Component Two',
        projectId: 'project-123',
        createdAt: '2023-01-02T00:00:00Z'
      }
    ];
    
    unifiedApi.component.listByProject.mockResolvedValue(mockSpecifications);
    
    // Render component specification list
    const ComponentSpecificationList = require('../components/ComponentSpecificationList').default;
    
    render(
      <BrowserRouter>
        <ComponentSpecificationList projectId="project-123" />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Component Specifications')).toBeInTheDocument();
    });
    
    // Check that specifications are displayed
    expect(screen.getByText('Component One')).toBeInTheDocument();
    expect(screen.getByText('Component Two')).toBeInTheDocument();
    expect(screen.getByText('Created: 1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('Created: 1/2/2023')).toBeInTheDocument();
    
    // Check that action buttons exist
    expect(screen.getByText('New Specification')).toBeInTheDocument();
    expect(screen.getAllByLabelText('view')).toHaveLength(2);
    expect(screen.getAllByLabelText('delete')).toHaveLength(2);
  });

  test('should view component specification details', async () => {
    // Mock API responses
    const mockSpecification = {
      id: 'comp-spec-123',
      componentName: 'Test Component',
      projectId: 'project-123',
      requirements: { content: 'WHEN user accesses component\nTHE SYSTEM SHALL display details' },
      design: { content: '# Design\n\n## Architecture\n\nComponent architecture' },
      tasks: { content: '# Tasks\n\n1. Implement UI\n2. Add tests' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    unifiedApi.component.get.mockResolvedValue(mockSpecification);
    
    // Mock useParams to return specific ID
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: 'comp-spec-123' });
    
    // Render component specification viewer
    const ComponentSpecificationViewer = require('../components/ComponentSpecificationViewer').default;
    
    render(
      <BrowserRouter>
        <ComponentSpecificationViewer />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Component')).toBeInTheDocument();
    });
    
    // Check that tabs are displayed
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    
    // Check that content is displayed
    expect(screen.getByText('WHEN user accesses component')).toBeInTheDocument();
    expect(screen.getByText('Component architecture')).toBeInTheDocument();
    expect(screen.getByText('Implement UI')).toBeInTheDocument();
    
    // Check that action buttons exist
    expect(screen.getByText('Regenerate')).toBeInTheDocument();
    expect(screen.getByText('Export All')).toBeInTheDocument();
  });
});