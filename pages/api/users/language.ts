import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const { languagePreference } = req.body;

  await sql`
    UPDATE users
    SET language_preference = ${languagePreference}
    WHERE id = ${userId};
  `;

  res.status(200).json({ message: 'Language preference updated' });
}

export default authMiddleware(handler);
