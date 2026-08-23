import { UserRole } from '@/typings/index.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkRole(role: UserRole): boolean {
  const validRoles: UserRole[] = ['captain', 'secretary', 'treasurer', 'councilor'];
  return validRoles.includes(role);
}
