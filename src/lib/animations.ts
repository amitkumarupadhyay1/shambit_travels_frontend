// Framer Motion animation variants for consistent animations across the app

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

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  }
};

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

export const buttonPress = {
  rest: { scale: 1 },
  press: { scale: 0.95 },
  hover: { scale: 1.05 }
};

export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Success celebration animation
export const successPulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      repeat: 2
    }
  }
};

// Notification slide in from right
export const notificationSlide = {
  hidden: { x: 400, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Page transition
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
