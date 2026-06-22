import { prisma } from './prisma';

export async function isLicenseValid(licenseNumber: string): Promise<boolean> {
  if (!licenseNumber) return false;
  
  const db = await prisma();
  const license = await db.usedLicense.findUnique({
    where: { licenseNumber },
  });
  
  // Valide si le code existe et n'est pas encore utilisé
  return !!license && !license.usedById;
}