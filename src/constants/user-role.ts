export const ROLES = {
  CAPTAIN: 'captain',
  SECRETARY: 'secretary',
  TREASURER: 'treasurer',
  COUNCILOR: 'councilor',
  TANOD: 'tanod',
  STAFF: 'staff',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
