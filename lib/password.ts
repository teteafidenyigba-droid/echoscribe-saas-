export interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

export function checkPassword(password: string): PasswordChecks {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const c = checkPassword(password);
  return c.length && c.uppercase && c.number && c.special;
}

export const PASSWORD_RULES = [
  { key: "length" as const,    label: "8 caractères minimum" },
  { key: "uppercase" as const, label: "Une majuscule" },
  { key: "number" as const,    label: "Un chiffre" },
  { key: "special" as const,   label: "Un caractère spécial (!@#…)" },
];
