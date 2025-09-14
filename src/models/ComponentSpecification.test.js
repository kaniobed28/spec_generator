import { ComponentSpecification } from './ComponentSpecification';

describe('ComponentSpecification', () => {
  test('should create a new component specification with default values', () => {
    const spec = new ComponentSpecification();
    
    expect(spec.id).toBeNull();
    expect(spec.componentName).toBe('');
    expect(spec.projectId).toBe('');
    expect(spec.projectSpecificationId).toBe(''); // New field test
    expect(spec.componentDescription).toBe('');
    expect(spec.requirements).toEqual({
      content: '',
      format: 'ears'
    });
    expect(spec.design).toEqual({
      content: '',
      architecture: '',
      diagrams: []
    });
    expect(spec.tasks).toEqual({
      content: '',
      breakdown: []
    });
    expect(spec.createdAt).toBeDefined();
    expect(spec.updatedAt).toBeDefined();
  });

  test('should create a component specification with provided data', () => {
    const data = {
      id: 'test-id',
      componentName: 'Test Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A test component',
      requirements: {
        content: 'Test requirements',
        format: 'ears'
      },
      design: {
        content: 'Test design',
        architecture: 'Test architecture',
        diagrams: ['diagram1', 'diagram2']
      },
      tasks: {
        content: 'Test tasks',
        breakdown: ['task1', 'task2']
      }
    };
    
    const spec = new ComponentSpecification(data);
    
    expect(spec.id).toBe('test-id');
    expect(spec.componentName).toBe('Test Component');
    expect(spec.projectId).toBe('project-123');
    expect(spec.projectSpecificationId).toBe('spec-456'); // New field test
    expect(spec.componentDescription).toBe('A test component');
    expect(spec.requirements).toEqual({
      content: 'Test requirements',
      format: 'ears'
    });
    expect(spec.design).toEqual({
      content: 'Test design',
      architecture: 'Test architecture',
      diagrams: ['diagram1', 'diagram2']
    });
    expect(spec.tasks).toEqual({
      content: 'Test tasks',
      breakdown: ['task1', 'task2']
    });
  });

  test('should validate a valid component specification', () => {
    const spec = new ComponentSpecification({
      componentName: 'Valid Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A valid component description that is long enough'
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  test('should validate component name is required', () => {
    const spec = new ComponentSpecification({
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A valid component description'
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Component name is required');
  });

  test('should validate component name length', () => {
    const spec = new ComponentSpecification({
      componentName: 'A'.repeat(101), // 101 characters, exceeds limit
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A valid component description'
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Component name must be less than 100 characters');
  });

  test('should validate project ID is required', () => {
    const spec = new ComponentSpecification({
      componentName: 'Valid Component',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A valid component description'
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Project ID is required');
  });

  test('should validate component description length minimum', () => {
    const spec = new ComponentSpecification({
      componentName: 'Valid Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'Short' // Less than 10 characters
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Component description must be at least 10 characters');
  });

  test('should validate component description length maximum', () => {
    const spec = new ComponentSpecification({
      componentName: 'Valid Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A'.repeat(1001) // 1001 characters, exceeds limit
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Component description must be less than 1000 characters');
  });

  test('should validate component name format', () => {
    const spec = new ComponentSpecification({
      componentName: 'Invalid@Component!', // Contains invalid characters
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A valid component description that is long enough'
    });
    
    const validation = spec.validate();
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('Component name can only contain alphanumeric characters, spaces, and hyphens');
  });

  test('should convert to object correctly', () => {
    const data = {
      id: 'test-id',
      componentName: 'Test Component',
      projectId: 'project-123',
      projectSpecificationId: 'spec-456', // New field
      componentDescription: 'A test component',
      requirements: {
        content: 'Test requirements',
        format: 'ears'
      },
      design: {
        content: 'Test design',
        architecture: 'Test architecture',
        diagrams: ['diagram1', 'diagram2']
      },
      tasks: {
        content: 'Test tasks',
        breakdown: ['task1', 'task2']
      }
    };
    
    const spec = new ComponentSpecification(data);
    const obj = spec.toObject();
    
    expect(obj).toEqual(data);
  });

  test('should update timestamp', () => {
    const spec = new ComponentSpecification();
    const originalUpdatedAt = spec.updatedAt;
    
    // Wait a bit to ensure time difference
    setTimeout(() => {
      spec.updateTimestamp();
      expect(spec.updatedAt).not.toBe(originalUpdatedAt);
    }, 10);
  });
});