import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  const userResult = await sql`SELECT role FROM users WHERE id = ${userId};`;
  const user = userResult.rows[0];

  if (user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const usersCountResult = await sql`SELECT COUNT(*) FROM users;`;
  const recommendationsCountResult = await sql`SELECT COUNT(*) FROM recommendations;`;
  const affiliateProgramsCountResult = await sql`SELECT COUNT(*) FROM affiliate_programs;`;

  res.status(200).json({
    usersCount: parseInt(usersCountResult.rows[0].count, 10),
    recommendationsCount: parseInt(recommendationsCountResult.rows[0].count, 10),
    affiliateProgramsCount: parseInt(affiliateProgramsCountResult.rows[0].count, 10),
  });
}

export default authMiddleware(handler);
