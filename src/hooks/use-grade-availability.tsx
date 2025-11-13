import { useMemo } from 'react';

const gradeHierarchy = ['Base', 'XLE', 'Limited', 'Platinum'];

interface UseGradeAvailabilityProps {
  currentGrade: string;
  requiredGrades: string[];
}

export const useGradeAvailability = ({ currentGrade, requiredGrades }: UseGradeAvailabilityProps) => {
  const isAvailable = useMemo(() => {
    return requiredGrades.includes(currentGrade);
  }, [currentGrade, requiredGrades]);

  const upgradeNeeded = useMemo(() => {
    if (isAvailable) return null;
    
    const currentIndex = gradeHierarchy.indexOf(currentGrade);
    const minRequiredGrade = requiredGrades
      .map(grade => gradeHierarchy.indexOf(grade))
      .filter(index => index !== -1)
      .sort((a, b) => a - b)[0];

    if (minRequiredGrade === undefined || currentIndex >= minRequiredGrade) {
      return null;
    }

    return gradeHierarchy[minRequiredGrade];
  }, [currentGrade, requiredGrades, isAvailable]);

  const getGradeStatus = useMemo(() => {
    if (isAvailable) {
      return {
        status: 'available' as const,
        message: 'Included in your grade',
        color: 'success'
      };
    }

    if (upgradeNeeded) {
      return {
        status: 'upgrade' as const,
        message: `Available from ${upgradeNeeded}`,
        color: 'warning',
        upgradeToGrade: upgradeNeeded
      };
    }

    return {
      status: 'unavailable' as const,
      message: 'Not available',
      color: 'muted'
    };
  }, [isAvailable, upgradeNeeded]);

  return {
    isAvailable,
    upgradeNeeded,
    gradeStatus: getGradeStatus
  };
};
