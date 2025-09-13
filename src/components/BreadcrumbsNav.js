import React, { useEffect } from 'react';
import { Breadcrumbs, Link, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { useSpecification } from '../contexts/SpecificationContext';

const BreadcrumbsNav = () => {
  const location = useLocation();
  const { id: projectId, componentSpecId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentProject, currentComponentSpecification, fetchProject, fetchComponentSpecification } = useSpecification();
  
  const pathnames = location.pathname.split('/').filter(x => x);

  // Fetch project details when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  // Fetch component specification details when componentSpecId changes
  useEffect(() => {
    if (componentSpecId) {
      fetchComponentSpecification(componentSpecId);
    }
  }, [componentSpecId]);

  const breadcrumbNameMap = {
    'projects': 'Projects',
    'specifications': 'Component Specifications',
    'generate': 'Generate',
    'component-specifications': 'Component Specifications',
    'settings': 'Settings'
  };

  if (pathnames.length === 0) {
    return null;
  }

  // Limit breadcrumbs on mobile to avoid clutter
  const maxBreadcrumbs = isMobile ? 3 : pathnames.length;
  const displayPathnames = pathnames.slice(-maxBreadcrumbs);

  // Build breadcrumb data with dynamic names
  const breadcrumbs = displayPathnames.map((value, index) => {
    const fullPath = pathnames.slice(0, pathnames.length - displayPathnames.length + index + 1);
    const to = `/${fullPath.join('/')}`;
    const isLast = index === displayPathnames.length - 1;
    
    // Determine display name based on context
    let displayName = breadcrumbNameMap[value] || value;
    
    // Special handling for project ID
    if (value === projectId && currentProject) {
      displayName = currentProject.name || 'Project';
    }
    
    // Special handling for component specification ID
    if (value === componentSpecId && currentComponentSpecification) {
      displayName = currentComponentSpecification.componentName || 'Component Specification';
    }
    
    // Capitalize first letter if it's a generic value
    if (displayName === value) {
      displayName = value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    return {
      to,
      isLast,
      displayName
    };
  });

  return (
    <Breadcrumbs 
      aria-label="breadcrumb" 
      sx={{ m: 2 }} 
      maxItems={isMobile ? 2 : 8}
      itemsAfterCollapse={isMobile ? 1 : 1}
    >
      <Link component={RouterLink} to="/">
        Home
      </Link>
      {breadcrumbs.map((crumb) => (
        crumb.isLast ? (
          <Typography color="text.primary" key={crumb.to}>
            {crumb.displayName}
          </Typography>
        ) : (
          <Link component={RouterLink} to={crumb.to} key={crumb.to}>
            {crumb.displayName}
          </Link>
        )
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;