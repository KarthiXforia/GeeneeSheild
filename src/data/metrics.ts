export const metrics = [
  {
    title: "Total Enrolled Devices",
    value: "24,862",
    change: 0.12,
  },
  {
    title: "Devices in Kiosk Mode",
    value: "18,645",
    change: 0.08,
  },
  {
    title: "Activation Success Rate",
    value: "94.3%",
    change: 0.05,
  },
  {
    title: "Accessibility Enabled",
    value: "21,794",
    change: 0.15,
  },
];

// Data with regional filters
export const filteredMetricsData = {
  // Default values (all)
  all: {
    totalEnrolled: 24862,
    inKioskMode: 18645,
    activeDevices: 23456,
    accessibilityEnabled: 21794,
    accessibilityPending: 3068,
    kioskWithAccessibility: 16892,
  },
  // By state
  states: {
    Karnataka: {
      totalEnrolled: 7254,
      inKioskMode: 5432,
      activeDevices: 6823,
      accessibilityEnabled: 6341,
      accessibilityPending: 913,
      kioskWithAccessibility: 4921,
    },
    "Tamil Nadu": {
      totalEnrolled: 6128,
      inKioskMode: 4589,
      activeDevices: 5754,
      accessibilityEnabled: 5387,
      accessibilityPending: 741,
      kioskWithAccessibility: 4165,
    },
    Maharashtra: {
      totalEnrolled: 8923,
      inKioskMode: 6687,
      activeDevices: 8423,
      accessibilityEnabled: 7825,
      accessibilityPending: 1098,
      kioskWithAccessibility: 6078,
    },
    Delhi: {
      totalEnrolled: 2557,
      inKioskMode: 1937,
      activeDevices: 2456,
      accessibilityEnabled: 2241,
      accessibilityPending: 316,
      kioskWithAccessibility: 1728,
    },
  },
  // By district - showing just a few examples
  districts: {
    "Bangalore Urban": {
      totalEnrolled: 3862,
      inKioskMode: 2876,
      activeDevices: 3645,
      accessibilityEnabled: 3423,
      accessibilityPending: 439,
      kioskWithAccessibility: 2634,
    },
    Mumbai: {
      totalEnrolled: 4237,
      inKioskMode: 3186,
      activeDevices: 3998,
      accessibilityEnabled: 3742,
      accessibilityPending: 495,
      kioskWithAccessibility: 2923,
    },
    Chennai: {
      totalEnrolled: 3128,
      inKioskMode: 2345,
      activeDevices: 2967,
      accessibilityEnabled: 2763,
      accessibilityPending: 365,
      kioskWithAccessibility: 2143,
    },
    "New Delhi": {
      totalEnrolled: 1876,
      inKioskMode: 1407,
      activeDevices: 1789,
      accessibilityEnabled: 1632,
      accessibilityPending: 244,
      kioskWithAccessibility: 1256,
    },
  },
  // By university
  universities: {
    "Bangalore University": {
      totalEnrolled: 2453,
      inKioskMode: 1834,
      activeDevices: 2321,
      accessibilityEnabled: 2156,
      accessibilityPending: 297,
      kioskWithAccessibility: 1672,
    },
    "Mumbai University": {
      totalEnrolled: 3187,
      inKioskMode: 2389,
      activeDevices: 3023,
      accessibilityEnabled: 2784,
      accessibilityPending: 403,
      kioskWithAccessibility: 2167,
    },
    "Anna University": {
      totalEnrolled: 2673,
      inKioskMode: 2004,
      activeDevices: 2512,
      accessibilityEnabled: 2346,
      accessibilityPending: 327,
      kioskWithAccessibility: 1823,
    },
    "Delhi University": {
      totalEnrolled: 1563,
      inKioskMode: 1178,
      activeDevices: 1487,
      accessibilityEnabled: 1372,
      accessibilityPending: 191,
      kioskWithAccessibility: 1054,
    },
  },
};
