import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const recommendationId = parseInt(req.query.id as string, 10);

  if (req.method === 'PUT') {
    const { content, isActive } = req.body;

    await sql`
      UPDATE recommendations
      SET
        content = ${content},
        is_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${recommendationId} AND user_id = ${userId};
    `;

    res.status(200).json({ message: 'Recommendation updated successfully' });
  } else if (req.method === 'DELETE') {
    await sql`
      DELETE FROM recommendations
      WHERE id = ${recommendationId} AND user_id = ${userId};
    `;

    res.status(200).json({ message: 'Recommendation deleted successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);
