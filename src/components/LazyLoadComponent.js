import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LazyLoadComponent = ({ 
  component: Component, 
  fallback = <LoadingSpinner message="Loading component..." />, 
  ...props 
}) => {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyLoadComponent;