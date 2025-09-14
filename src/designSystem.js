// Design System Constants based on the design documentation

// Color Palette
export const COLORS = {
  // Primary Colors
  PRIMARY_BLUE: '#1976D2',
  PRIMARY_DARK: '#1565C0',
  PRIMARY_LIGHT: '#BBDEFB',
  
  // Secondary Colors
  SECONDARY: '#F50057',
  SECONDARY_DARK: '#C51162',
  SECONDARY_LIGHT: '#FF80AB',
  
  // Neutral Colors
  DARK: '#212121',
  MEDIUM: '#757575',
  LIGHT: '#F5F5F5',
  WHITE: '#FFFFFF',
  
  // Status Colors
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  ERROR: '#F44336',
  INFO: '#2196F3'
};

// Typography Scale
export const TYPOGRAPHY = {
  FONT_FAMILY: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  FONT_FAMILY_MONO: 'Consolas, Monaco, "Fira Code", monospace',
  
  // Font Scale
  HEADING_1: {
    size: '2.5rem',
    weight: 700
  },
  HEADING_2: {
    size: '2rem',
    weight: 600
  },
  HEADING_3: {
    size: '1.5rem',
    weight: 600
  },
  HEADING_4: {
    size: '1.25rem',
    weight: 600
  },
  BODY_LARGE: {
    size: '1rem',
    weight: 400
  },
  BODY_MEDIUM: {
    size: '0.875rem',
    weight: 400
  },
  BODY_SMALL: {
    size: '0.75rem',
    weight: 400
  },
  BUTTON: {
    size: '0.875rem',
    weight: 500
  }
};

// Spacing Scale (8px base)
export const SPACING = {
  XS: 4,    // 4px
  SM: 8,    // 8px
  MD: 16,   // 16px
  LG: 24,   // 24px
  XL: 32,   // 32px
  XXL: 48   // 48px
};

// Border Radius
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 16
};

// Shadows
export const SHADOWS = {
  NONE: 'none',
  SMALL: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  MEDIUM: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  LARGE: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)'
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920
};

// Z-Index
export const Z_INDEX = {
  APP_BAR: 1100,
  DRAWER: 1200,
  MODAL: 1300,
  SNACKBAR: 1400,
  TOOLTIP: 1500
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BREAKPOINTS,
  Z_INDEX
};