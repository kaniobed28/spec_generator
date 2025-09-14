import React from 'react';
import { Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ResponsiveContainer = ({ children, maxWidth = "lg", ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container 
      maxWidth={maxWidth}
      {...props}
      sx={{
        px: isMobile ? 1 : 2,
        ...props.sx
      }}
    >
      {children}
    </Container>
  );
};

export default ResponsiveContainer;