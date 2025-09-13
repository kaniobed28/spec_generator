import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

// Collections
const PROJECTS_COLLECTION = 'projects';
const SPECIFICATIONS_COLLECTION = 'specifications';
const COMPONENT_SPECIFICATIONS_COLLECTION = 'componentSpecifications';

// Create a new project
export const createProject = async (projectData) => {
  try {
    const projectRef = doc(collection(db, PROJECTS_COLLECTION));
    const project = {
      id: projectRef.id,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(projectRef, project);
    return project;
  } catch (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }
};

// Get project by ID
export const getProject = async (id) => {
  try {
    const projectDoc = await getDoc(doc(db, PROJECTS_COLLECTION, id));
    if (!projectDoc.exists()) {
      return null;
    }
    return { id: projectDoc.id, ...projectDoc.data() };
  } catch (error) {
    throw new Error(`Error fetching project: ${error.message}`);
  }
};

// Update project
export const updateProject = async (id, updateData) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    const updatedProject = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(projectRef, updatedProject);
    return { id, ...updatedProject };
  } catch (error) {
    throw new Error(`Error updating project: ${error.message}`);
  }
};

// Delete project
export const deleteProject = async (id) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    return { message: 'Project deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting project: ${error.message}`);
  }
};

// Get all projects
export const getAllProjects = async () => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const projects = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    return projects;
  } catch (error) {
    throw new Error(`Error fetching projects: ${error.message}`);
  }
};

// Create specification
export const createSpecification = async (specData) => {
  try {
    const specRef = doc(collection(db, SPECIFICATIONS_COLLECTION));
    const specification = {
      id: specRef.id,
      ...specData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(specRef, specification);
    return specification;
  } catch (error) {
    throw new Error(`Error creating specification: ${error.message}`);
  }
};

// Get specification by ID
export const getSpecification = async (id) => {
  try {
    const specDoc = await getDoc(doc(db, SPECIFICATIONS_COLLECTION, id));
    if (!specDoc.exists()) {
      return null;
    }
    return { id: specDoc.id, ...specDoc.data() };
  } catch (error) {
    throw new Error(`Error fetching specification: ${error.message}`);
  }
};

// Get specification by project ID
export const getSpecificationByProjectId = async (projectId) => {
  try {
    const q = query(
      collection(db, SPECIFICATIONS_COLLECTION),
      where('projectId', '==', projectId)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Error fetching specification by project ID: ${error.message}`);
  }
};

// Update specification
export const updateSpecification = async (id, updateData) => {
  try {
    const specRef = doc(db, SPECIFICATIONS_COLLECTION, id);
    const updatedSpec = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(specRef, updatedSpec);
    return { id, ...updatedSpec };
  } catch (error) {
    throw new Error(`Error updating specification: ${error.message}`);
  }
};

// Delete specification
export const deleteSpecification = async (id) => {
  try {
    await deleteDoc(doc(db, SPECIFICATIONS_COLLECTION, id));
    return { message: 'Specification deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting specification: ${error.message}`);
  }
};

// Create component specification
export const createComponentSpecification = async (specData) => {
  try {
    const specRef = doc(collection(db, COMPONENT_SPECIFICATIONS_COLLECTION));
    
    if (!specRef.id) {
      throw new Error('Failed to generate document ID');
    }
    
    // Ensure the ID is properly set in the specification data
    const specification = {
      id: specRef.id,
      ...specData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('firebaseService.createComponentSpecification: Setting document with ID:', specRef.id);
    console.log('firebaseService.createComponentSpecification: Data to save:', specification);
    
    await setDoc(specRef, specification);
    
    // Return the specification with confirmed ID
    const result = {
      ...specification,
      id: specRef.id
    };
    
    console.log('firebaseService.createComponentSpecification: Returning result with ID:', result.id);
    return result;
  } catch (error) {
    console.error('Error creating component specification:', error);
    throw new Error(`Error creating component specification: ${error.message}`);
  }
};

// Get component specification by ID
export const getComponentSpecification = async (id) => {
  try {
    const specDoc = await getDoc(doc(db, COMPONENT_SPECIFICATIONS_COLLECTION, id));
    
    if (!specDoc.exists()) {
      return null;
    }
    
    return { id: specDoc.id, ...specDoc.data() };
  } catch (error) {
    console.error('Error fetching component specification:', error);
    throw new Error(`Error fetching component specification: ${error.message}`);
  }
};

// Get component specifications by project ID
export const getComponentSpecificationsByProjectId = async (projectId) => {
  try {
    const q = query(
      collection(db, COMPONENT_SPECIFICATIONS_COLLECTION),
      where('projectId', '==', projectId)
    );
    
    const querySnapshot = await getDocs(q);
    const specifications = [];
    
    querySnapshot.forEach((doc) => {
      specifications.push({ id: doc.id, ...doc.data() });
    });
    
    return specifications;
  } catch (error) {
    throw new Error(`Error fetching component specifications by project ID: ${error.message}`);
  }
};

// Update component specification
export const updateComponentSpecification = async (id, updateData) => {
  try {
    const specRef = doc(db, COMPONENT_SPECIFICATIONS_COLLECTION, id);
    const updatedSpec = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(specRef, updatedSpec);
    return { id, ...updatedSpec };
  } catch (error) {
    throw new Error(`Error updating component specification: ${error.message}`);
  }
};

// Delete component specification
export const deleteComponentSpecification = async (id) => {
  try {
    await deleteDoc(doc(db, COMPONENT_SPECIFICATIONS_COLLECTION, id));
    return { message: 'Component specification deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting component specification: ${error.message}`);
  }
};

// Get all component specifications
export const getAllComponentSpecifications = async () => {
  try {
    const q = query(collection(db, COMPONENT_SPECIFICATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const specifications = [];
    
    querySnapshot.forEach((doc) => {
      specifications.push({ id: doc.id, ...doc.data() });
    });
    
    return specifications;
  } catch (error) {
    throw new Error(`Error fetching component specifications: ${error.message}`);
  }
};
