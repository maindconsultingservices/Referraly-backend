import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const id = parseInt(req.query.id as string);

  if (req.method === 'PUT') {
    const { content, isActive } = req.body;

    await prisma.recommendation.updateMany({
      where: { id, userId },
      data: { content, isActive },
    });

    res.status(200).json({ message: 'Recommendation updated' });
  } else if (req.method === 'DELETE') {
    await prisma.recommendation.deleteMany({
      where: { id, userId },
    });

    res.status(200).json({ message: 'Recommendation deleted' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);
