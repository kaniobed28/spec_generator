import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ProjectInput from './components/ProjectInput';
import SpecificationViewer from './components/SpecificationViewer';
import ComponentSpecificationGenerator from './components/ComponentSpecificationGenerator';
import ComponentSpecificationViewer from './components/ComponentSpecificationViewer';
import ComponentSpecificationList from './components/ComponentSpecificationList';
import ProjectsPage from './components/ProjectsPage';
import ComponentsPage from './components/ComponentsPage';
import { SpecificationProvider } from './contexts/SpecificationContext';
import { Box, Toolbar } from '@mui/material';
import ProjectNavigation from './components/ProjectNavigation';
import BreadcrumbsNav from './components/BreadcrumbsNav';

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
              <Route path="/" element={<ProjectInput />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/projects/:id" element={
                <>
                  <ProjectNavigation />
                  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <SpecificationViewer />
                  </Box>
                </>
              } />
              <Route path="/projects/:id/specifications" element={
                <>
                  <ProjectNavigation />
                  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <ComponentSpecificationList />
                  </Box>
                </>
              } />
              <Route path="/projects/:id/specifications/generate" element={
                <>
                  <ProjectNavigation />
                  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <ComponentSpecificationGenerator />
                  </Box>
                </>
              } />
              <Route path="/component-specifications/:id" element={<ComponentSpecificationViewer />} />
              <Route path="/debug/component-specifications" element={
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <ComponentsPage />
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