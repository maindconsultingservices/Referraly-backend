import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const programId = parseInt(req.query.programId as string, 10);

  const result = await sql`SELECT * FROM affiliate_programs WHERE id = ${programId};`;

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Affiliate program not found' });
  }

  res.status(200).json(result.rows[0]);
}
