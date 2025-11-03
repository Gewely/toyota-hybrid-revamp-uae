// Haptic feedback types
type HapticType = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid' | 'selection' | 'success' | 'warning' | 'error';

// Check if haptic feedback is enabled (you might want to read this from a settings store)
const isHapticEnabled = (): boolean => {
  return typeof window !== 'undefined' && 'HapticFeedback' in window;
};

// Trigger haptic feedback based on type
const triggerHaptic = (type: HapticType): void => {
  if (typeof window === 'undefined' || !('HapticFeedback' in window)) {
    console.warn('Haptic Feedback API not supported');
    return;
  }

  const haptic = (window as any).HapticFeedback;

  switch (type) {
    case 'light':
      haptic.lightImpact();
      break;
    case 'medium':
      haptic.mediumImpact();
      break;
    case 'heavy':
      haptic.heavyImpact();
      break;
    case 'soft':
      haptic.softImpact();
      break;
    case 'rigid':
      haptic.rigidImpact();
      break;
    case 'selection':
      haptic.selection();
      break;
    case 'success':
      haptic.notificationSuccess();
      break;
    case 'warning':
      haptic.notificationWarning();
      break;
    case 'error':
      haptic.notificationError();
      break;
    default:
      console.warn('Unknown haptic type:', type);
  }
};

// Luxury Haptic Patterns
type LuxuryHapticType = 'luxuryPress' | 'premiumError' | 'configComplete' | 'stepProgress' | 'resetAction' | 'exitAction' | 'swipeNavigation';

// Enhanced contextual haptic feedback with pattern library
export const contextualHaptic = {
  swipeNavigation: () => {
    if (isHapticEnabled()) {
      triggerHaptic('light');
    }
  },
  stepProgress: () => {
    if (isHapticEnabled()) {
      triggerHaptic('medium');
    }
  },
  configComplete: () => {
    if (isHapticEnabled()) {
      triggerHaptic('success');
    }
  },
  resetAction: () => {
    if (isHapticEnabled()) {
      triggerHaptic('warning');
    }
  },
  exitAction: () => {
    if (isHapticEnabled()) {
      triggerHaptic('error');
    }
  },
  
  // Enhanced button interactions
  buttonPress: () => {
    if (isHapticEnabled()) {
      triggerHaptic('light');
    }
  },

  // Enhanced selection feedback
  selectionChange: () => {
    if (isHapticEnabled()) {
      triggerHaptic('medium');
    }
  },

  // Enhanced error feedback
  errorFeedback: () => {
    if (isHapticEnabled()) {
      triggerHaptic('heavy');
    }
  },

  // New haptic patterns
  categorySwitch: () => {
    if (isHapticEnabled()) {
      triggerHaptic('light');
    }
  },
  
  sheetOpen: () => {
    if (isHapticEnabled()) {
      triggerHaptic('medium');
    }
  },
  
  limitReached: () => {
    if (isHapticEnabled()) {
      triggerHaptic('error');
      setTimeout(() => triggerHaptic('error'), 100);
    }
  },
  
  successAction: () => {
    if (isHapticEnabled()) {
      triggerHaptic('success');
    }
  },
  
  toggleMode: () => {
    if (isHapticEnabled()) {
      triggerHaptic('heavy');
    }
  }
};

// Enhanced function to add luxury haptic feedback to buttons
export const addLuxuryHapticToButton = (
  button: HTMLButtonElement,
  options: {
    type: LuxuryHapticType;
    onPress?: boolean;
    onHover?: boolean;
  }
): void => {
  if (!button) {
    console.warn('Button element is null or undefined');
    return;
  }

  const { type, onPress = true, onHover = false } = options;

  const hapticAction = () => {
    switch (type) {
      case 'luxuryPress':
        contextualHaptic.buttonPress();
        break;
      case 'premiumError':
        contextualHaptic.errorFeedback();
        break;
      case 'configComplete':
        contextualHaptic.configComplete();
        break;
      case 'stepProgress':
        contextualHaptic.stepProgress();
        break;
      case 'resetAction':
        contextualHaptic.resetAction();
        break;
      case 'exitAction':
        contextualHaptic.exitAction();
        break;
      case 'swipeNavigation':
        contextualHaptic.swipeNavigation();
        break;
      default:
        console.warn('Unknown luxury haptic type:', type);
    }
  };

  if (onPress) {
    button.addEventListener('click', hapticAction);
  }

  if (onHover) {
    button.addEventListener('mouseenter', hapticAction);
  }
};
