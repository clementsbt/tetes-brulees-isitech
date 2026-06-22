// In-memory user store (for demo - use database in production)
const users = new Map<string, { email: string; password: string; licenseNumber: string }>();

export function createUser(email: string, password: string, licenseNumber: string): void {
  users.set(email, { email, password, licenseNumber });
}

export function findUser(email: string) {
  return users.get(email);
}

export function validateUser(email: string, password: string): boolean {
  const user = users.get(email);
  return user?.password === password;
}