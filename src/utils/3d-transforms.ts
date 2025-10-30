export const calculate3DRotation = (
  mouseX: number,
  mouseY: number,
  elementRect: DOMRect,
  maxRotation = 15
): { rotateX: number; rotateY: number } => {
  const centerX = elementRect.left + elementRect.width / 2;
  const centerY = elementRect.top + elementRect.height / 2;
  
  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  
  const rotateY = (deltaX / (elementRect.width / 2)) * maxRotation;
  const rotateX = -(deltaY / (elementRect.height / 2)) * maxRotation;
  
  return { rotateX, rotateY };
};

export const calculatePerspective = (
  distance: number,
  viewportCenter: number,
  maxPerspective = 1000
): number => {
  const normalizedDistance = Math.abs(distance - viewportCenter) / viewportCenter;
  return maxPerspective * (1 - normalizedDistance * 0.5);
};

export const calculateDepthSorting = (
  index: number,
  total: number,
  viewportCenter: number,
  containerWidth: number
): { scale: number; zIndex: number; opacity: number } => {
  const itemCenter = (containerWidth / total) * (index + 0.5);
  const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
  const normalizedDistance = distanceFromCenter / (containerWidth / 2);
  
  const scale = 1 - normalizedDistance * 0.3;
  const zIndex = Math.round((1 - normalizedDistance) * 100);
  const opacity = 1 - normalizedDistance * 0.4;
  
  return { scale, zIndex, opacity };
};

export const createRotationMatrix = (
  rotateX: number,
  rotateY: number,
  rotateZ: number
): string => {
  return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
};

export const calculateCarouselRotation = (
  index: number,
  total: number,
  currentIndex: number
): { rotateY: number; translateZ: number; opacity: number } => {
  const anglePerItem = 360 / total;
  const angle = anglePerItem * (index - currentIndex);
  const radius = 300;
  
  const rotateY = angle;
  const translateZ = radius;
  const normalizedAngle = Math.abs(angle % 360);
  const opacity = normalizedAngle < 90 || normalizedAngle > 270 ? 1 : 0.3;
  
  return { rotateY, translateZ, opacity };
};

export const applyHolographicEffect = (
  mouseX: number,
  mouseY: number,
  elementRect: DOMRect
): { background: string } => {
  const relativeX = ((mouseX - elementRect.left) / elementRect.width) * 100;
  const relativeY = ((mouseY - elementRect.top) / elementRect.height) * 100;
  
  const background = `
    radial-gradient(
      circle at ${relativeX}% ${relativeY}%, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.1) 30%,
      transparent 60%
    ),
    linear-gradient(
      ${relativeX}deg,
      rgba(168, 85, 247, 0.2) 0%,
      rgba(59, 130, 246, 0.2) 50%,
      rgba(236, 72, 153, 0.2) 100%
    )
  `;
  
  return { background };
};

export const calculateMomentumScroll = (
  velocity: number,
  maxVelocity = 5
): { scale: number; blur: number; opacity: number } => {
  const normalizedVelocity = Math.min(velocity / maxVelocity, 1);
  
  return {
    scale: 1 + normalizedVelocity * 0.05,
    blur: normalizedVelocity * 3,
    opacity: 1 - normalizedVelocity * 0.2,
  };
};
