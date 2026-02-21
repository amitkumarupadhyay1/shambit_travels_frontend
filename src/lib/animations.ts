// Framer Motion animation variants for consistent animations across the app

// ============================================================================
// BASIC ANIMATIONS
// ============================================================================

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

// ============================================================================
// CARD & HOVER ANIMATIONS
// ============================================================================

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const cardHoverSubtle = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.01,
    y: -2,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

export const cardHoverBold = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

// ============================================================================
// BUTTON ANIMATIONS
// ============================================================================

export const buttonPress = {
  rest: { scale: 1 },
  press: { scale: 0.95 },
  hover: { scale: 1.05 }
};

export const buttonRipple = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02 }
};

export const buttonPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

export const spinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity
    }
  }
};

export const dots = {
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
};

export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
};

// ============================================================================
// FEEDBACK ANIMATIONS
// ============================================================================

export const successPulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: 2
    }
  }
};

export const successCheckmark = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5 },
      opacity: { duration: 0.2 }
    }
  }
};

export const errorShake = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5
    }
  }
};

export const errorPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.3,
      repeat: 2
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6
    }
  }
};

// ============================================================================
// FORM VALIDATION ANIMATIONS
// ============================================================================

export const formFieldError = {
  initial: { x: 0 },
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.4
    }
  }
};

export const formFieldSuccess = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 0.3
    }
  }
};

export const validationMessage = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: 0.2
    }
  }
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const staggerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0
    }
  }
};

export const staggerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

// ============================================================================
// NOTIFICATION ANIMATIONS
// ============================================================================

export const notificationSlide = {
  hidden: { x: 400, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { stiffness: 100, damping: 15 }
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const notificationSlideDown = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { stiffness: 100, damping: 15 }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const toast = {
  hidden: { opacity: 0, y: 50, scale: 0.3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      stiffness: 200,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageTransition = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 }
  }
};

export const pageTransitionFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const pageTransitionSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

export const pageTransitionScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// MODAL & OVERLAY ANIMATIONS
// ============================================================================

export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  }
};

export const drawer = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: "100%",
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation variant with reduced motion support
 */
export function getAnimationVariant<T>(variant: T, reducedVariant?: Partial<T>): T {
  if (prefersReducedMotion() && reducedVariant) {
    return { ...variant, ...reducedVariant } as T;
  }
  return variant;
}

/**
 * Disable animations if user prefers reduced motion
 */
export const reducedMotionConfig = {
  initial: false,
  animate: prefersReducedMotion() ? false : "visible",
  exit: prefersReducedMotion() ? false : "exit"
};
