export type PasswordGeneratorOptions = {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
};

export const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

export class PasswordGenerator {
  private static readonly DEFAULT_LENGTH = 16;
  private static readonly MIN_LENGTH = 4;

  /**
   * Generates a cryptographically secure random integer within [0, max)
   * free of modulo bias across both Web Crypto and Node environments.
   */
  private static getRandomInt(max: number): number {
    if (max <= 0) return 0;

    const maxValid = 256 - (256 % max);
    const buffer = new Uint8Array(1);

    while (true) {
      crypto.getRandomValues(buffer);
      const byte = buffer[0];
      if (byte !== undefined && byte < maxValid) {
        return byte % max;
      }
    }
  }

  /**
   * Selects a single random character from a given character set string.
   */
  private static getRandomChar(charset: string): string {
    if (!charset.length) return '';
    const index = this.getRandomInt(charset.length);
    return charset.charAt(index);
  }

  /**
   * Performs an in-place Fisher-Yates shuffle using cryptographically secure randomness.
   */
  private static shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.getRandomInt(i + 1);
      const current = array[i];
      const target = array[j];

      if (current !== undefined && target !== undefined) {
        array[i] = target;
        array[j] = current;
      }
    }
    return array;
  }

  /**
   * Core generator function.
   */
  public static generate(options: PasswordGeneratorOptions = {}): string {
    const {
      length = this.DEFAULT_LENGTH,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
    } = options;

    if (length < this.MIN_LENGTH) {
      throw new Error(`Password length must be at least ${this.MIN_LENGTH} characters.`);
    }

    const enabledSets: string[] = [];

    if (includeUppercase) enabledSets.push(CHARACTER_SETS.uppercase);
    if (includeLowercase) enabledSets.push(CHARACTER_SETS.lowercase);
    if (includeNumbers) enabledSets.push(CHARACTER_SETS.numbers);
    if (includeSymbols) enabledSets.push(CHARACTER_SETS.symbols);

    const availableChars = enabledSets.join('');

    if (!availableChars.length) {
      throw new Error('At least one character type must be selected.');
    }

    const passwordChars: string[] = [];

    // 1. Guarantee at least one character from each selected set
    for (const set of enabledSets) {
      passwordChars.push(this.getRandomChar(set));
    }

    // 2. Fill remaining character slots
    while (passwordChars.length < length) {
      passwordChars.push(this.getRandomChar(availableChars));
    }

    // 3. Cryptographically shuffle character array
    return this.shuffle(passwordChars).join('');
  }
}

// Export wrapper function for backwards compatibility
export function generateSecurePassword(options?: PasswordGeneratorOptions): string {
  return PasswordGenerator.generate(options);
}
