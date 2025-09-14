import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import { SpecificationProvider } from './contexts/SpecificationContext';
import { Box, Toolbar } from '@mui/material';
import ProjectNavigation from './components/ProjectNavigation';
import BreadcrumbsNav from './components/BreadcrumbsNav';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const ProjectInput = React.lazy(() => import('./components/ProjectInput'));
const SpecificationViewer = React.lazy(() => import('./components/SpecificationViewer'));
const ComponentSpecificationGenerator = React.lazy(() => import('./components/ComponentSpecificationGenerator'));
const ComponentSpecificationViewer = React.lazy(() => import('./components/ComponentSpecificationViewer'));
const ComponentSpecificationList = React.lazy(() => import('./components/ComponentSpecificationList'));
const ProjectsPage = React.lazy(() => import('./components/ProjectsPage'));
const ComponentsPage = React.lazy(() => import('./components/ComponentsPage'));

function App() {
  return (
    <Router>
      <SpecificationProvider>
        <div className="App">
          <Header />
          <Toolbar /> {/* This adds spacing below the fixed header */}
          <BreadcrumbsNav />
          <Box sx={{ display: 'flex' }}>
            <Routes>
              <Route path="/" element={
                <Suspense fallback={<LoadingSpinner message="Loading home page..." />}>
                  <ProjectInput />
                </Suspense>
              } />
              <Route path="/projects" element={
                <Suspense fallback={<LoadingSpinner message="Loading projects..." />}>
                  <ProjectsPage />
                </Suspense>
              } />
              <Route path="/components" element={
                <Suspense fallback={<LoadingSpinner message="Loading components..." />}>
                  <ComponentsPage />
                </Suspense>
              } />
              <Route path="/projects/:id" element={
                <>
                  <Box component="main" sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    width: { md: `calc(100% - 240px)` }
                  }}>
                    <Suspense fallback={<LoadingSpinner message="Loading specification..." />}>
                      <SpecificationViewer />
                    </Suspense>
                  </Box>
                  <ProjectNavigation />
                </>
              } />
              <Route path="/projects/:id/specifications" element={
                <>
                  <Box component="main" sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    width: { md: `calc(100% - 240px)` }
                  }}>
                    <Suspense fallback={<LoadingSpinner message="Loading component specifications..." />}>
                      <ComponentSpecificationList />
                    </Suspense>
                  </Box>
                  <ProjectNavigation />
                </>
              } />
              <Route path="/projects/:id/specifications/generate" element={
                <>
                  <Box component="main" sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    width: { md: `calc(100% - 240px)` }
                  }}>
                    <Suspense fallback={<LoadingSpinner message="Loading generator..." />}>
                      <ComponentSpecificationGenerator />
                    </Suspense>
                  </Box>
                  <ProjectNavigation />
                </>
              } />
              <Route path="/component-specifications/:id" element={
                <Suspense fallback={<LoadingSpinner message="Loading component specification..." />}>
                  <ComponentSpecificationViewer />
                </Suspense>
              } />
              <Route path="/debug/component-specifications" element={
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Suspense fallback={<LoadingSpinner message="Loading debug page..." />}>
                    <ComponentsPage />
                  </Suspense>
                </Box>
              } />
            </Routes>
          </Box>
        </div>
      </SpecificationProvider>
    </Router>
  );
}

export default App;