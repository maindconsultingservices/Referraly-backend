import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  if (req.method === 'GET') {
    const result = await sql`SELECT * FROM recommendations WHERE user_id = ${userId};`;
    res.status(200).json(result.rows);
  } else if (req.method === 'POST') {
    const { content, programId } = req.body;

    await sql`
      INSERT INTO recommendations (
        user_id,
        content,
        program_id,
        created_at,
        updated_at,
        is_active
      ) VALUES (
        ${userId},
        ${content},
        ${programId},
        NOW(),
        NOW(),
        TRUE
      );
    `;

    res.status(201).json({ message: 'Recommendation created successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);
