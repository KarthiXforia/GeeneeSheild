// Donut chart data for kiosk mode vs active mode
export const deviceModeDistribution = {
  // Default data (all)
  all: {
    inKioskMode: 18645,
    inActiveMode: 6217,
  },
  // By state
  states: {
    Karnataka: {
      inKioskMode: 5432,
      inActiveMode: 1822,
    },
    "Tamil Nadu": {
      inKioskMode: 4589,
      inActiveMode: 1539,
    },
    Maharashtra: {
      inKioskMode: 6687,
      inActiveMode: 2236,
    },
    Delhi: {
      inKioskMode: 1937,
      inActiveMode: 620,
    },
  },
  // By district
  districts: {
    "Bangalore Urban": {
      inKioskMode: 2876,
      inActiveMode: 986,
    },
    Mumbai: {
      inKioskMode: 3186,
      inActiveMode: 1051,
    },
    Chennai: {
      inKioskMode: 2345,
      inActiveMode: 783,
    },
    "New Delhi": {
      inKioskMode: 1407,
      inActiveMode: 469,
    },
  },
  // By university
  universities: {
    "Bangalore University": {
      inKioskMode: 1834,
      inActiveMode: 619,
    },
    "Mumbai University": {
      inKioskMode: 2389,
      inActiveMode: 798,
    },
    "Anna University": {
      inKioskMode: 2004,
      inActiveMode: 669,
    },
    "Delhi University": {
      inKioskMode: 1178,
      inActiveMode: 385,
    },
  },
};

// Accessibility permissions data (requirement #6)
export const accessibilityPermissionsData = {
  enabled: 21794,
  pending: 3068,
};

// Devices in kiosk mode with accessibility permissions (requirement #7)
export const kioskWithAccessibilityData = {
  count: 16892,
  percentage: 90.6, // Percentage of kiosk devices with accessibility
};

// Keep this for compatibility with existing components
export const customerSatisfication = {
  positive: 0.8,
  neutral: 0.15,
  negative: 0.05,
};

export const totalCustomers = 156;
