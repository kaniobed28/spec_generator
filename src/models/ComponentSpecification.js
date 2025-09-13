// Component Specification Data Model
export class ComponentSpecification {
  constructor(data = {}) {
    this.id = data.id || null;
    this.componentName = data.componentName || '';
    this.projectId = data.projectId || '';
    this.componentDescription = data.componentDescription || '';
    this.requirements = data.requirements || {
      content: '',
      format: 'ears' // EARS format by default
    };
    this.design = data.design || {
      content: '',
      architecture: '',
      diagrams: []
    };
    this.tasks = data.tasks || {
      content: '',
      breakdown: []
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validate the component specification
  validate() {
    const errors = [];

    if (!this.componentName || this.componentName.trim().length === 0) {
      errors.push('Component name is required');
    }

    if (this.componentName && this.componentName.length > 100) {
      errors.push('Component name must be less than 100 characters');
    }

    if (!this.projectId || this.projectId.trim().length === 0) {
      errors.push('Project ID is required');
    }

    if (this.componentDescription && this.componentDescription.length > 1000) {
      errors.push('Component description must be less than 1000 characters');
    }

    if (this.componentDescription && this.componentDescription.length < 10) {
      errors.push('Component description must be at least 10 characters');
    }

    // Validate component name format (alphanumeric with spaces and hyphens only)
    if (this.componentName && !/^[a-zA-Z0-9\s\-]+$/.test(this.componentName)) {
      errors.push('Component name can only contain alphanumeric characters, spaces, and hyphens');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for serialization
  toObject() {
    return {
      id: this.id,
      componentName: this.componentName,
      projectId: this.projectId,
      componentDescription: this.componentDescription,
      requirements: this.requirements,
      design: this.design,
      tasks: this.tasks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Update the timestamp
  updateTimestamp() {
    this.updatedAt = new Date().toISOString();
  }
}

export default ComponentSpecification;