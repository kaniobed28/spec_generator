import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  createProject, 
  getProject, 
  updateProject, 
  deleteProject, 
  getAllProjects,
  createSpecification,
  getSpecification,
  getSpecificationByProjectId,
  updateSpecification,
  deleteSpecification,
  createComponentSpecification,
  getComponentSpecification,
  getComponentSpecificationsByProjectId,
  updateComponentSpecification,
  deleteComponentSpecification,
  getAllComponentSpecifications
} from './firebaseService';

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'your-default-api-key');

// Function to generate specification content using Gemini
const generateSpecificationContent = async (name, description, template, files, userStories = [], perspectives = [], acceptanceCriteria = [], customRequirements = []) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create a prompt based on project details and user inputs
    let prompt = `Generate comprehensive software project specifications for a "${template}" named "${name}" with the following description: "${description}".`;

    // Add user stories to the prompt if provided
    if (userStories.length > 0) {
      prompt += `

User Stories:
${userStories.map(story => `- As a user, I want ${story.what} so that ${story.why}`).join('\\n')}`;
    }

    // Add perspectives to the prompt if provided
    if (perspectives.length > 0) {
      prompt += `

Perspectives:
${perspectives.map(p => `- From ${p.role} perspective: ${p.viewpoint}`).join('\\n')}`;
    }

    // Add acceptance criteria to the prompt if provided
    if (acceptanceCriteria.length > 0) {
      prompt += `

Acceptance Criteria:
${acceptanceCriteria.map((c, i) => `${i+1}. ${c.description}`).join('\\n')}`;
    }

    // Add custom requirements to the prompt if provided
    if (customRequirements.length > 0) {
      prompt += `

Custom Requirements:
${customRequirements.map(r => `- ${r.description}`).join('\\n')}`;
    }

    prompt += `\n\nPlease organize the response in the following sections with appropriate markdown headings:
1. Planning: Project scope, objectives, technical requirements, timeline estimation, and resource allocation
2. Design: System architecture, component design, UI/UX specifications, and database schema
3. Implementation: Technology stack recommendations, coding standards, file structure, and API specifications
4. Tasks: Development tasks breakdown, assignment recommendations, dependencies, and milestones

Format the response as markdown with proper headings and lists. Do not include any additional text or explanations outside of these sections.`;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into sections
    const sections = parseSpecificationResponse(text);
    
    return sections;
  } catch (error) {
    console.error('Error generating specification content:', error);
    // Return mock data in case of error
    return createMockSpecification(template, name);
  }
};

// Parse the AI response into structured sections
const parseSpecificationResponse = (text) => {
  // This is a simplified parser - in a real implementation, you might want to use a more robust markdown parser
  const sections = {
    planning: { title: 'Planning', content: '' },
    design: { title: 'Design', content: '' },
    implementation: { title: 'Implementation', content: '' },
    tasks: { title: 'Tasks', content: '' }
  };
  
  // Split the text by sections
  const planningMatch = text.match(/##?\s*1\.\s*Planning.*?(?=##?\s*(2\.|Design|System|\\z))/is);
  const designMatch = text.match(/##?\s*2\.\s*Design.*?(?=##?\s*(3\.|Implementation|Technology|\\z))/is);
  const implementationMatch = text.match(/##?\s*3\.\s*Implementation.*?(?=##?\s*(4\.|Tasks|Development|\\z))/is);
  const tasksMatch = text.match(/##?\s*4\.\s*Tasks.*?(?=\\z)/is);
  
  if (planningMatch) sections.planning.content = planningMatch[0];
  if (designMatch) sections.design.content = designMatch[0];
  if (implementationMatch) sections.implementation.content = implementationMatch[0];
  if (tasksMatch) sections.tasks.content = tasksMatch[0];
  
  return sections;
};

// Create mock specification data for fallback
const createMockSpecification = (template, name) => {
  return {
    planning: {
      title: 'Planning',
      content: `## Project Scope and Objectives

The objective of this project is to develop a comprehensive ${template} named ${name}.

### Technical Requirements

- Responsive design for all device sizes
- User authentication and authorization
- Modern technology stack
- Performance optimization

### Timeline Estimation

- Phase 1: Project setup and basic UI (2 weeks)
- Phase 2: Core functionality development (4 weeks)
- Phase 3: Testing and refinement (2 weeks)
- Phase 4: Deployment and documentation (1 week)

### Resource Allocation

- 2 Developers
- 1 Designer
- 1 Project Manager
- 1 QA Engineer`
    },
    design: {
      title: 'Design',
      content: `## System Architecture

The application will follow a modern architecture pattern suitable for a ${template}.

### Component Design

- Core components based on project requirements
- Reusable UI elements
- Consistent design system

### UI/UX Specifications

- Clean, modern design with a focus on usability
- Consistent color scheme and typography
- Intuitive navigation and user flows

### Database Schema

- Users table
- Project data tables
- Configuration tables`
    },
    implementation: {
      title: 'Implementation',
      content: `## Technology Stack Recommendations

Based on the project requirements, the following technology stack is recommended:

- Frontend: React with modern hooks
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Hosting: Cloud platform (AWS, Google Cloud, or Azure)

## Coding Standards

- Follow modern JavaScript/TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write unit tests for critical components

## File Structure

\`\`\`
src/
├── components/
├── pages/
├── services/
├── utils/
├── assets/
└── styles/
\`\`\`

## API Specifications

RESTful APIs will be implemented based on project requirements.`
    },
    tasks: {
      title: 'Tasks',
      content: `## Development Tasks Breakdown

### Frontend Tasks
1. Set up project structure
2. Create component library
3. Implement core functionality
4. Add authentication flows
5. Create responsive design

### Backend Tasks
1. Set up server environment
2. Configure database connection
3. Implement authentication system
4. Develop core APIs
5. Set up deployment pipeline

### Assignment Recommendations

- Lead Developer: Senior Developer
- Frontend Developer: Frontend Specialist
- Backend Developer: Backend Specialist
- QA Engineer: Testing Specialist

### Dependencies Between Tasks

- Project setup must be completed before other tasks
- Authentication must be implemented before user-specific features
- Database schema must be finalized before API development

### Milestones

- Week 2: Project setup and basic structure
- Week 6: Core functionality implementation
- Week 8: Testing and refinement
- Week 9: Deployment and documentation`
    }
  };
};

// Project API functions
export const projectApi = {
  // Create a new project
  createProject: async (projectData) => {
    return await createProject(projectData);
  },

  // Get project by ID
  getProject: async (id) => {
    return await getProject(id);
  },

  // Update project
  updateProject: async (id, projectData) => {
    return await updateProject(id, projectData);
  },

  // Delete project
  deleteProject: async (id) => {
    return await deleteProject(id);
  },

  // Get all projects for user
  getAllProjects: async () => {
    return await getAllProjects();
  },
};

// Specification API functions
export const specificationApi = {
  // Generate specifications using Gemini AI
  generateSpecifications: async (projectData) => {
    // Create project first
    const project = await createProject(projectData);
    
    // Generate specification content using Gemini
    const content = await generateSpecificationContent(
      projectData.name, 
      projectData.description, 
      projectData.template, 
      projectData.files,
      projectData.userStories,
      projectData.perspectives,
      projectData.acceptanceCriteria,
      projectData.customRequirements
    );
    
    // Create specification document
    const specification = await createSpecification({
      projectId: project.id,
      title: projectData.name,
      sections: content
    });
    
    return {
      project,
      specification
    };
  },

  // Get specifications by ID
  getSpecifications: async (id) => {
    return await getSpecification(id);
  },

  // Get specifications by project ID
  getSpecificationsByProject: async (projectId) => {
    return await getSpecificationByProjectId(projectId);
  },

  // Update specifications
  updateSpecifications: async (id, specData) => {
    return await updateSpecification(id, specData);
  },

  // Delete specifications
  deleteSpecifications: async (id) => {
    return await deleteSpecification(id);
  },
};

// Component Specification API functions
export const componentSpecificationApi = {
  // Create a new component specification
  createComponentSpecification: async (specData) => {
    return await createComponentSpecification(specData);
  },

  // Get component specification by ID
  getComponentSpecification: async (id) => {
    return await getComponentSpecification(id);
  },

  // Get component specifications by project ID
  getComponentSpecificationsByProject: async (projectId) => {
    return await getComponentSpecificationsByProjectId(projectId);
  },

  // Update component specification
  updateComponentSpecification: async (id, specData) => {
    return await updateComponentSpecification(id, specData);
  },

  // Delete component specification
  deleteComponentSpecification: async (id) => {
    return await deleteComponentSpecification(id);
  },

  // Get all component specifications
  getAllComponentSpecifications: async () => {
    return await getAllComponentSpecifications();
  },
};

// AI Content Generation functions for component specifications
const generateComponentRequirements = async (componentName, componentDescription, projectSpecification = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let prompt = `Generate requirements in EARS (Easy Approach to Requirements Syntax) format for a component named "${componentName}" with the following description: "${componentDescription}".`;
    
    // Add project context if available
    if (projectSpecification) {
      prompt += `
      
      These requirements should align with the overall project specification:
      Project Title: ${projectSpecification.title || 'Untitled Project'}
      ${projectSpecification.sections ? `
      Project Planning: ${projectSpecification.sections.planning?.content || ''}
      Project Design: ${projectSpecification.sections.design?.content || ''}
      Project Implementation: ${projectSpecification.sections.implementation?.content || ''}
      ` : ''}
      `;
    }
    
    prompt += `
    
    Format each requirement as:
    WHEN [trigger or condition]
    THE SYSTEM SHALL [expected behavior]
    
    Example:
    WHEN a user accesses the login page
    THE SYSTEM SHALL display input fields for username and password
    
    Please generate 5-10 requirements for this component. Number each requirement.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating component requirements:', error);
    return `# Requirements for ${componentName}\n\nError generating requirements: ${error.message}`;
  }
};

const generateComponentDesign = async (componentName, componentDescription, requirements, projectSpecification = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let prompt = `Generate technical design documentation for a component named "${componentName}" with the following description: "${componentDescription}".
    
    The component should satisfy these requirements:
    ${requirements}`;
    
    // Add project context if available
    if (projectSpecification) {
      prompt += `
      
      This design should align with the overall project architecture:
      ${projectSpecification.sections?.design?.content || 'No project design information available'}
      `;
    }
    
    prompt += `
    
    Please organize the response with the following sections:
    1. Architecture Overview
    2. Component Roles
    3. Interaction Diagrams (describe in text)
    4. Data Flow
    
    Format the response as markdown with proper headings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating component design:', error);
    return `# Design for ${componentName}\n\nError generating design: ${error.message}`;
  }
};

const generateComponentTasks = async (componentName, componentDescription, design, projectSpecification = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let prompt = `Generate implementation tasks for a component named "${componentName}" with the following description: "${componentDescription}".
    
    The technical design is:
    ${design}`;
    
    // Add project context if available
    if (projectSpecification) {
      prompt += `
      
      These tasks should follow the project implementation approach:
      ${projectSpecification.sections?.implementation?.content || 'No project implementation information available'}
      `;
    }
    
    prompt += `
    
    Please organize the response with the following sections:
    1. Task Breakdown (list discrete, trackable tasks)
    2. Dependencies (prerequisites for each task)
    3. Expected Outcomes (clear definition of task completion)
    
    Format the response as markdown with proper headings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating component tasks:', error);
    return `# Tasks for ${componentName}\n\nError generating tasks: ${error.message}`;
  }
};

// Enhanced API with AI functions
export const enhancedApi = {
  projectApi,
  specificationApi,
  componentSpecificationApi,
  
  // AI Generation functions
  generateComponentRequirements,
  generateComponentDesign,
  generateComponentTasks
};

// Export individual functions for use in unified API
export {
  // Project API functions
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getAllProjects,
  
  // Specification API functions
  createSpecification,
  getSpecification,
  getSpecificationByProjectId,
  updateSpecification,
  deleteSpecification,
  
  // Component Specification API functions
  createComponentSpecification,
  getComponentSpecification,
  getComponentSpecificationsByProjectId,
  updateComponentSpecification,
  deleteComponentSpecification,
  getAllComponentSpecifications,
  
  // AI Generation functions
  generateComponentRequirements,
  generateComponentDesign,
  generateComponentTasks
};

const api = {
  projectApi,
  specificationApi,
  componentSpecificationApi
};

export default api;
