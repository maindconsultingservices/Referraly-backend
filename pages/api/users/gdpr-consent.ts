import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  await sql`
    UPDATE users
    SET gdpr_consent = TRUE, gdpr_consent_date = NOW()
    WHERE id = ${userId};
  `;

  res.status(200).json({ message: 'GDPR consent recorded' });
}

export default authMiddleware(handler);
