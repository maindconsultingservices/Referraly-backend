import crypto from 'crypto';

export function generateExternalAffiliateId(userId: number, programId: number, secretKey: string): string {
  const data = `${userId}-${programId}`;
  const hash = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
  return hash.substring(0, 12);
}
